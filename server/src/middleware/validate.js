const PHONE_REGEX = /^[0-9]{10,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
const NAME_REGEX = /^[a-zA-Z\s\-'.,()]+$/;
const ADDRESS_MIN_LENGTH = 5;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const STRING_MAX_LENGTH = 5000;

const VALID_STATUSES = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
const VALID_ROLES = ['customer', 'worker', 'admin'];
const VALID_PAYMENT_METHODS = ['cash', 'online'];

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')
    .replace(/[\0\b\f\n\r\t\v]/g, '')
    .trim()
    .substring(0, STRING_MAX_LENGTH);
}

function sanitizeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .substring(0, STRING_MAX_LENGTH);
}

function validatePhone(phone) {
  if (typeof phone !== 'string') return { valid: false, error: 'Phone number is required' };
  const clean = phone.replace(/\s+/g, '');
  if (!PHONE_REGEX.test(clean)) {
    return { valid: false, error: 'Phone number must be 10-15 digits' };
  }
  return { valid: true, value: clean };
}

function validateEmail(email) {
  if (!email) return { valid: true, value: null };
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true, value: email.trim().toLowerCase() };
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  if (!PASSWORD_REGEX.test(password)) {
    return { valid: false, error: 'Password must contain uppercase, lowercase, and a number' };
  }
  return { valid: true, value: password };
}

function validateName(name) {
  if (typeof name !== 'string' || name.trim().length < NAME_MIN_LENGTH) {
    return { valid: false, error: `Name must be at least ${NAME_MIN_LENGTH} characters` };
  }
  if (name.trim().length > NAME_MAX_LENGTH) {
    return { valid: false, error: `Name must be at most ${NAME_MAX_LENGTH} characters` };
  }
  return { valid: true, value: sanitize(name) };
}

function validateAddress(address) {
  if (typeof address !== 'string' || address.trim().length < ADDRESS_MIN_LENGTH) {
    return { valid: false, error: `Address must be at least ${ADDRESS_MIN_LENGTH} characters` };
  }
  return { valid: true, value: sanitize(address) };
}

function validateEnum(value, allowed, fieldName) {
  if (!value || !allowed.includes(value)) {
    return { valid: false, error: `${fieldName} must be one of: ${allowed.join(', ')}` };
  }
  return { valid: true, value };
}

function validateRating(rating) {
  if (typeof rating !== 'number' || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return { valid: false, error: 'Rating must be an integer between 1 and 5' };
  }
  return { valid: true, value: rating };
}

function validateNumber(value, min, max, fieldName) {
  if (typeof value !== 'number' || isNaN(value) || value < min || value > max) {
    return { valid: false, error: `${fieldName} must be a number between ${min} and ${max}` };
  }
  return { valid: true, value };
}

function validateId(id, fieldName) {
  if (typeof id !== 'string' || id.trim().length === 0) {
    return { valid: false, error: `${fieldName || 'ID'} is required` };
  }
  const sanitized = sanitize(id);
  if (sanitized.length > 100) {
    return { valid: false, error: `${fieldName || 'ID'} is too long` };
  }
  return { valid: true, value: sanitized };
}

function validateDate(dateStr) {
  if (typeof dateStr !== 'string') return { valid: false, error: 'Date is required' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  return { valid: true, value: dateStr };
}

function validateBoolean(val) {
  if (val === true || val === false) return { valid: true, value: val };
  if (val === 1 || val === 0) return { valid: true, value: Boolean(val) };
  if (val === 'true' || val === '1') return { valid: true, value: true };
  if (val === 'false' || val === '0') return { valid: true, value: false };
  return { valid: false, error: 'Must be a boolean' };
}

function sanitizeObject(obj, schema) {
  const errors = [];
  const result = {};
  for (const [field, rules] of Object.entries(schema)) {
    const value = obj[field];
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    if (value === undefined || value === null) {
      if (rules.default !== undefined) {
        result[field] = rules.default;
      }
      continue;
    }
    if (rules.type === 'string') {
      const s = sanitize(String(value));
      if (rules.maxLength && s.length > rules.maxLength) {
        errors.push(`${field} exceeds max length of ${rules.maxLength}`);
        continue;
      }
      if (rules.pattern && !rules.pattern.test(s)) {
        errors.push(`${field} has invalid format`);
        continue;
      }
      result[field] = rules.trim !== false ? s : String(value);
    } else if (rules.type === 'number') {
      const n = Number(value);
      if (isNaN(n)) { errors.push(`${field} must be a number`); continue; }
      if (rules.min !== undefined && n < rules.min) { errors.push(`${field} must be at least ${rules.min}`); continue; }
      if (rules.max !== undefined && n > rules.max) { errors.push(`${field} must be at most ${rules.max}`); continue; }
      result[field] = n;
    } else if (rules.type === 'boolean') {
      const b = validateBoolean(value);
      if (!b.valid) { errors.push(`${field} must be a boolean`); continue; }
      result[field] = b.value;
    } else if (rules.type === 'enum') {
      const e = validateEnum(value, rules.values, field);
      if (!e.valid) { errors.push(e.error); continue; }
      result[field] = e.value;
    } else {
      result[field] = value;
    }
  }
  return { valid: errors.length === 0, data: result, errors };
}

module.exports = {
  sanitize,
  sanitizeHtml,
  validatePhone,
  validateEmail,
  validatePassword,
  validateName,
  validateAddress,
  validateEnum,
  validateRating,
  validateNumber,
  validateId,
  validateDate,
  validateBoolean,
  sanitizeObject,
  VALID_STATUSES,
  VALID_ROLES,
  VALID_PAYMENT_METHODS,
};
