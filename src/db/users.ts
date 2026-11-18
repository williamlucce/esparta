import { eq } from 'drizzle-orm';
import { db } from './index.ts';
import { users } from './schema.ts';

const ADMIN_EMAILS = new Set([
  'admin@espartaimobiliaria.com.br',
  'williamlucce@gmail.com',
]);

export async function getUserByUid(uid: string) {
  try {
    const rows = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error('Database query failed (getUserByUid):', error);
    throw new Error('Erro ao consultar usuário.', { cause: error });
  }
}

export async function getUserByEmail(email: string) {
  try {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error('Database query failed (getUserByEmail):', error);
    throw new Error('Erro ao consultar usuário por e-mail.', { cause: error });
  }
}

export async function getOrCreateUser(uid: string, email: string, name: string) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const role = ADMIN_EMAILS.has(normalizedEmail) ? 'admin' : 'client';
    const result = await db
      .insert(users)
      .values({
        uid,
        email: normalizedEmail,
        name: name || normalizedEmail.split('@')[0],
        role,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: normalizedEmail,
          name: name || normalizedEmail.split('@')[0],
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed (getOrCreateUser):', error);
    throw new Error('Erro ao sincronizar usuário.', { cause: error });
  }
}

export async function createLocalUser(params: {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role?: 'admin' | 'client';
}) {
  try {
    const normalizedEmail = params.email.toLowerCase().trim();
    const result = await db
      .insert(users)
      .values({
        uid: params.uid,
        name: params.name.trim(),
        email: normalizedEmail,
        phone: params.phone?.trim() || null,
        passwordHash: params.passwordHash,
        role: params.role || 'client',
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed (createLocalUser):', error);
    throw new Error('Erro ao cadastrar usuário.', { cause: error });
  }
}
