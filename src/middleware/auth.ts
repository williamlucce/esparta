import { NextFunction, Request, Response } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { verifySessionToken } from '../lib/auth-crypto.ts';
import { getOrCreateUser, getUserByUid } from '../db/users.ts';

export interface AuthUserContext {
  id: number;
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
}

export interface AuthRequest extends Request {
  authUser?: AuthUserContext;
}

async function resolveAuthUser(req: AuthRequest): Promise<AuthUserContext | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) return null;

  // 1. Check HMAC session token (email/password login)
  const session = verifySessionToken(token);
  if (session) {
    const dbUser = await getUserByUid(session.uid);
    if (!dbUser) return null;
    return {
      id: dbUser.id,
      uid: dbUser.uid,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role === 'admin' ? 'admin' : 'client',
    };
  }

  // 2. Verify Firebase ID token (Google Sign-In via Firebase Auth)
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const email = decoded.email || `${decoded.uid}@espartaimobiliaria.com.br`;
    const name = decoded.name || email.split('@')[0];
    const dbUser = await getOrCreateUser(decoded.uid, email, name);
    return {
      id: dbUser.id,
      uid: dbUser.uid,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role === 'admin' ? 'admin' : 'client',
    };
  } catch {
    return null;
  }
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await resolveAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Não autorizado. Faça login para continuar.' });
    }
    req.authUser = user;
    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await resolveAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Autenticação administrativa necessária.' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso restrito a administradores.' });
    }
    req.authUser = user;
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(401).json({ error: 'Sessão administrativa inválida.' });
  }
};
