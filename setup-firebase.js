const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

let autoAnswers = (process.env.AUTO_ANSWERS || '').split('|').map(s => s.trim());
let autoIdx = 0;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = async q => {
  if (autoAnswers[autoIdx] !== undefined) {
    const a = autoAnswers[autoIdx++];
    console.log(q + a);
    return a;
  }
  return new Promise(r => rl.question(q, r));
};
let FB_TOKEN = '';
const FB = cmd => `npx firebase-tools ${cmd}${FB_TOKEN ? ` --token="${FB_TOKEN}"` : ''}`;
const SH = cmd => execSync(cmd, { stdio: 'inherit', shell: true });
const SH_ = cmd => execSync(cmd, { encoding: 'utf-8', shell: true }).trim();

const ENV_PATH = path.join(__dirname, 'server', '.env');

function color(s, c) { return `\x1b[${c}m${s}\x1b[0m`; }
const green = s => color(s, 32);
const cyan = s => color(s, 36);
const yellow = s => color(s, 33);
const red = s => color(s, 31);

async function main() {
  console.log(cyan('\n========================================'));
  console.log(cyan('   GharSathi — Firebase Auto Setup'));
  console.log(cyan('========================================\n'));

  // ─── 1. Check / Install firebase-tools ───
  console.log(yellow('[1/7] Checking Firebase CLI...'));
  let fb;
  try {
    fb = SH_('npx --yes firebase-tools --version');
    console.log(green(`  Firebase CLI v${fb} detected`));
  } catch {
    console.log(yellow('  Installing firebase-tools...'));
    SH('npm install -g firebase-tools');
    fb = SH_('firebase --version');
  }

  // ─── 2. Login ───
  console.log(yellow('\n[2/7] Logging into Firebase...'));
  let firebaseToken = process.env.FIREBASE_TOKEN;
  if (!firebaseToken) {
    console.log(yellow('\n  --- Firebase Login Required ---'));
    console.log(yellow('  Run this command in your LOCAL terminal (CMD/PowerShell):'));
    console.log(cyan('  npx firebase-tools login:ci'));
    console.log(yellow('  It will open a browser. After login, copy the token and paste it here.'));
    firebaseToken = await ask('  Firebase CI token: ');
    if (!firebaseToken || !firebaseToken.trim()) {
      console.log(red('  No token provided. You can set FIREBASE_TOKEN env var and rerun.'));
      console.log(yellow('  Continuing with limited functionality...'));
      firebaseToken = '';
    } else {
      firebaseToken = firebaseToken.trim();
      console.log(green('  Token accepted'));
    }
  }
  FB_TOKEN = firebaseToken;

  // ─── 3. Project ───
  console.log(yellow('\n[3/7] Firebase Project'));
  const projects = SH_(FB('projects:list --json 2>nul'));
  let projectList = [];
  try {
    projectList = JSON.parse(projects).result || [];
  } catch {}

  let projectId;
  if (projectList.length > 0) {
    console.log('  Existing projects:');
    projectList.forEach((p, i) => console.log(`    ${i + 1}. ${p.projectId} (${p.displayName || '-'})`));
    const choice = await ask('  Enter number to use existing, or "new" to create one: ');
    if (choice.toLowerCase() === 'new') {
      projectId = await createProject();
    } else {
      const idx = parseInt(choice) - 1;
      if (idx >= 0 && idx < projectList.length) {
        projectId = projectList[idx].projectId;
        console.log(green(`  Using project: ${projectId}`));
      } else {
        console.log(yellow('  Invalid choice, creating new...'));
        projectId = await createProject();
      }
    }
  } else {
    projectId = await createProject();
  }

  // ─── 4. Enable Identity Toolkit API ───
  console.log(yellow('\n[4/7] Enabling Identity Toolkit API (Firebase Auth)...'));
  console.log(yellow('  This enables Firebase Authentication for your project.'));
  console.log(cyan(`  Open this URL in your browser:`));
  console.log(cyan(`  https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=${projectId}`));
  console.log(yellow('  Click "Enable" and wait for it to complete.'));
  await ask('  Press Enter after enabling the API...');

  // ─── 5. Enable Phone Auth provider ───
  console.log(yellow('\n[5/7] Enabling Phone Authentication...'));
  console.log(yellow('  Phone sign-in must be enabled in Firebase Console.'));
  console.log(cyan(`  Open: https://console.firebase.google.com/project/${projectId}/authentication/providers`));
  console.log(yellow('  → Go to "Sign-in method" tab'));
  console.log(yellow('  → Click "Phone"'));
  console.log(yellow('  → Click "Enable" → "Save"'));
  await ask('  Press Enter after enabling Phone auth...');

  // ─── 6. Create Web App & Get Config ───
  console.log(yellow('\n[6/7] Creating Web App and fetching config...'));
  let appId, configJson;
  try {
    const appsRaw = SH_(FB(`apps:list WEB --json --project=${projectId} 2>nul`));
    const apps = JSON.parse(appsRaw).result || [];
    let existingApp = apps.find(a => a.displayName && a.displayName.includes('gharsathi'));
    if (existingApp) {
      appId = existingApp.appId;
      console.log(green(`  Using existing app: ${existingApp.displayName}`));
    } else {
      const appName = 'gharsathi-web';
      const createRaw = SH_(FB(`apps:create WEB ${appName} --project=${projectId} --json 2>nul`));
      appId = JSON.parse(createRaw).result.appId;
      console.log(green(`  Created web app: ${appName} (${appId})`));
    }
    const configRaw = SH_(FB(`apps:sdkconfig WEB ${appId} --project=${projectId} --json 2>nul`));
    const parsed = JSON.parse(configRaw).result?.sdkConfig;
    if (parsed) {
      configJson = {
        apiKey: parsed.apiKey,
        authDomain: parsed.authDomain,
        projectId: parsed.projectId,
        storageBucket: parsed.storageBucket,
        messagingSenderId: parsed.messagingSenderId,
        appId: parsed.appId,
      };
    }
  } catch (e) {
    console.log(yellow('  Could not auto-create web app.'));
    console.log(yellow('  Create one manually: Firebase Console → Project Settings → Add app → Web'));
    console.log(yellow('  Then copy the firebaseConfig values.'));
    configJson = await manualConfig();
  }

  // ─── 7. Generate Service Account Key ───
  console.log(yellow('\n[7/7] Generating Service Account key...'));
  let saKeyJson = null;
  const keyPath = path.join(__dirname, 'server', `${projectId}-firebase-key.json`);
  console.log(yellow('  A service account key lets your server verify Firebase tokens.'));
  console.log(cyan(`  Open: https://console.firebase.google.com/project/${projectId}/settings/serviceaccounts/adminsdk`));
  console.log(yellow('  → Click "Generate new private key"'));
  console.log(yellow('  → Confirm by clicking "Generate key"'));
  console.log(yellow(`  → Save the downloaded JSON file as: ${keyPath}`));
  const keyInput = await ask('  Or paste the full JSON key here (or press Enter to skip): ');
  if (keyInput.trim().startsWith('{')) {
    saKeyJson = keyInput.trim();
    fs.writeFileSync(keyPath, saKeyJson);
    console.log(green('  Key saved'));
  } else if (fs.existsSync(keyPath)) {
    saKeyJson = fs.readFileSync(keyPath, 'utf-8');
    console.log(green('  Key file found on disk'));
  }

  // ─── Write to .env ───
  if (configJson || saKeyJson) {
    console.log(yellow('\n--- Writing to .env ---'));
    let envContent = '';
    if (fs.existsSync(ENV_PATH)) {
      envContent = fs.readFileSync(ENV_PATH, 'utf-8');
    }

    envContent = addOrReplace(envContent, 'FIREBASE_API_KEY', configJson?.apiKey);
    envContent = addOrReplace(envContent, 'FIREBASE_AUTH_DOMAIN', configJson?.authDomain);
    envContent = addOrReplace(envContent, 'FIREBASE_PROJECT_ID', configJson?.projectId);
    envContent = addOrReplace(envContent, 'FIREBASE_STORAGE_BUCKET', configJson?.storageBucket);
    envContent = addOrReplace(envContent, 'FIREBASE_MESSAGING_SENDER_ID', configJson?.messagingSenderId);
    envContent = addOrReplace(envContent, 'FIREBASE_APP_ID', configJson?.appId);

    if (saKeyJson) {
      const escaped = saKeyJson.replace(/\n/g, '\\n').replace(/"/g, '\\"');
      envContent = addOrReplace(envContent, 'FIREBASE_SERVICE_ACCOUNT', escaped);
    }

    fs.writeFileSync(ENV_PATH, envContent);
    console.log(green(`  Configuration written to: ${ENV_PATH}`));
  }

  console.log(cyan('\n========================================'));
  console.log(cyan('   Firebase Setup Complete!'));
  console.log(cyan('========================================'));
  console.log(green('\n  ✓ Firebase CLI configured'));
  console.log(green('  ✓ Identity Toolkit API enabled'));
  console.log(green('  ✓ Phone auth enabled'));
  console.log(green('  ✓ Web app created & config fetched'));
  console.log(green('  ✓ Service account key generated'));
  console.log(green('\n  Start your server and test login!'));
  console.log(green('  npm start\n'));

  rl.close();
}

async function createProject() {
  let name = await ask('  Enter a project name (e.g. "gharsathi-app"): ');
  if (!name || !name.trim()) name = 'gharsathi-' + Date.now().toString(36);
  name = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
  try {
    console.log(`  Creating project "${name}"...`);
    SH(FB(`projects:create ${name} --display-name="GharSathi"`));
    console.log(green(`  Project created: ${name}`));
    return name;
  } catch (e) {
    console.log(red(`  Failed: ${e.message}`));
    process.exit(1);
  }
}

async function manualConfig() {
  console.log(yellow('\n  Enter Firebase Web App config (from Firebase Console → Project Settings → Web App):'));
  const apiKey = await ask('    apiKey: ');
  const authDomain = await ask('    authDomain: ');
  const projectId = await ask('    projectId: ');
  const storageBucket = await ask('    storageBucket: ');
  const messagingSenderId = await ask('    messagingSenderId: ');
  const appId = await ask('    appId: ');
  return { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
}

function addOrReplace(content, key, value) {
  if (!value) return content;
  const regex = new RegExp(`^${key}=.*$`, 'm');
  const line = `${key}=${value}`;
  if (regex.test(content)) {
    return content.replace(regex, line);
  }
  return content + '\n' + line;
}

main().catch(err => {
  console.error(red('\nSetup failed:', err.message));
  process.exit(1);
});
