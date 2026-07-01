require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { query, queryOne, execute } = require('../database');
const { generateAccessToken, generateRefreshToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || '';
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || '';
const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/api/auth/google/callback`,
    passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      const googleId = profile.id;
      const name = profile.displayName || 'Google User';
      const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : `https://i.pravatar.cc/200?u=google_${googleId}`;

      let user = googleId ? await queryOne('SELECT * FROM users WHERE id = ?', `google_${googleId}`) : null;
      if (!user && email) {
        user = await queryOne('SELECT * FROM users WHERE email = ?', email);
      }

      if (!user) {
        const id = `google_${googleId}`;
        const hashed = await bcrypt.hash(googleId + JWT_SECRET, 10);
        const role = req.query.state === 'worker' ? 'worker' : 'customer';
        await execute(
          'INSERT INTO users (id, name, phone, email, password, role, avatar, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          id, name, null, email, hashed, role, avatar, 'Jodhpur, Rajasthan'
        );
        user = await queryOne('SELECT * FROM users WHERE id = ?', id);
      }

      done(null, { user, state: req.query.state || 'customer' });
    } catch (err) {
      done(err, null);
    }
  }));
}

if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: `${BASE_URL}/api/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'emails', 'photos'],
    passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      const facebookId = profile.id;
      const name = profile.displayName || 'Facebook User';
      const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : `https://i.pravatar.cc/200?u=fb_${facebookId}`;

      let user = facebookId ? await queryOne('SELECT * FROM users WHERE id = ?', `fb_${facebookId}`) : null;
      if (!user && email) {
        user = await queryOne('SELECT * FROM users WHERE email = ?', email);
      }

      if (!user) {
        const id = `fb_${facebookId}`;
        const hashed = await bcrypt.hash(facebookId + JWT_SECRET, 10);
        const role = req.query.state === 'worker' ? 'worker' : 'customer';
        await execute(
          'INSERT INTO users (id, name, phone, email, password, role, avatar, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          id, name, null, email, hashed, role, avatar, 'Jodhpur, Rajasthan'
        );
        user = await queryOne('SELECT * FROM users WHERE id = ?', id);
      }

      done(null, { user, state: req.query.state || 'customer' });
    } catch (err) {
      done(err, null);
    }
  }));
}

router.get('/google', (req, res, next) => {
  const state = req.query.role || req.query.state || 'customer';
  const redirect = req.query.redirect || (state === 'worker' ? 'worker.html' : 'customer.html');
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: `${state}|${redirect}`,
    session: false,
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false, failureRedirect: '/?login=failed' }, async (err, data) => {
    if (err || !data) {
      return res.redirect('/?login=failed');
    }
    try {
      const { user, state } = data;
      const parts = (state || 'customer|customer.html').split('|');
      const role = parts[0] || 'customer';
      const redirectPage = parts[1] || (role === 'worker' ? 'worker.html' : 'customer.html');
      const session = await createOAuthSession(user, req);
      res.redirect(`${redirectPage}?token=${session.accessToken}&refresh=${session.refreshToken}&oauth=true`);
    } catch (e) {
      res.redirect('/?login=error');
    }
  })(req, res, next);
});

router.get('/facebook', (req, res, next) => {
  const state = req.query.role || req.query.state || 'customer';
  const redirect = req.query.redirect || (state === 'worker' ? 'worker.html' : 'customer.html');
  passport.authenticate('facebook', {
    scope: ['email'],
    state: `${state}|${redirect}`,
    session: false,
  })(req, res, next);
});

router.get('/facebook/callback', (req, res, next) => {
  passport.authenticate('facebook', { session: false, failureRedirect: '/?login=failed' }, async (err, data) => {
    if (err || !data) {
      return res.redirect('/?login=failed');
    }
    try {
      const { user, state } = data;
      const parts = (state || 'customer|customer.html').split('|');
      const role = parts[0] || 'customer';
      const redirectPage = parts[1] || (role === 'worker' ? 'worker.html' : 'customer.html');
      const session = await createOAuthSession(user, req);
      res.redirect(`${redirectPage}?token=${session.accessToken}&refresh=${session.refreshToken}&oauth=true`);
    } catch (e) {
      res.redirect('/?login=error');
    }
  })(req, res, next);
});

async function createOAuthSession(user, req) {
  const accessToken = generateAccessToken(user);
  const refresh = await generateRefreshToken(user, req);
  return { accessToken, refreshToken: refresh.id, sessionId: refresh.sessionId };
}

module.exports = router;
