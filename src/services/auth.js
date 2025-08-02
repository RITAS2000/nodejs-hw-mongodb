import * as fs from 'node:fs';
import path from 'node:path';
import { User } from '../models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { Session } from '../models/session.js';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendMail } from '../utils/sendMail.js';
import Handlebars from 'handlebars';

const REQUEST_PASSWORD_RESET_TEMPLATE = fs.readFileSync(
  path.resolve('src', 'templates', 'request-password-reset.hbs'),
  'utf-8',
);

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw createHttpError.Conflict('Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw createHttpError.Unauthorized('Email or password is incorrect');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (isPasswordMatch !== true) {
    throw createHttpError.Unauthorized('Email or password is incorrect');
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);

  if (session === null) {
    throw createHttpError.Unauthorized('Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw createHttpError.Unauthorized('Refresh token is invalid');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError.Unauthorized('Refresh token is expired');
  }

  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

export async function resetPasswordMail(email) {
  const user = await User.findOne({ email });
  if (user == null) {
    throw createHttpError.NotFound('User not found');
  }

  const token = jwt.sign(
    {
      sub: user._id,
      user: user.name,
    },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '5m' },
  );

  const template = Handlebars.compile(REQUEST_PASSWORD_RESET_TEMPLATE);
  const resetPasswordLink = `${getEnvVar(
    'APP_DOMAIN',
  )}/reset-password?token=${token}`;

  await sendMail({
    to: email,
    subject: 'Reset password',
    html: template({
      resetPasswordLink: resetPasswordLink,
    }),
  });
}

export async function resetPassword(token, password) {
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

    const user = await User.findById(decoded.sub);

    if (user === null) {
      throw createHttpError.NotFound('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch {
    throw createHttpError.Unauthorized('Token is expired or invalid.');
  }
}
