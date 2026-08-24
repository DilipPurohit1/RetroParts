import jwt from 'jsonwebtoken';
import { Response } from 'express';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'retroparts_access_secret_key_min_32_chars_jwt_auth_production_secure';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'retroparts_refresh_secret_key_min_32_chars_jwt_auth_production_secure';
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface TokenPayload {
  id: string;
  role: string;
}

export const generateTokens = (id: string, role: string) => {
  const accessToken = jwt.sign({ id, role }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES as any,
  });

  const refreshToken = jwt.sign({ id, role }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES as any,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('retroparts_refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/',
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie('retroparts_refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
};
