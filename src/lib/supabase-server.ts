import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

function normalizeSupabaseUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('SUPABASE_URL geçerli bir URL olmalıdır.');
  }

  const apiPath = url.pathname.replace(/\/+$/, '');
  const isSupportedApiPath = apiPath === '' || apiPath === '/rest/v1';

  if (!isSupportedApiPath || url.search || url.hash) {
    throw new Error(
      'SUPABASE_URL panel bağlantısı değil, yalnızca proje API kök adresi olmalıdır (https://proje-ref.supabase.co).',
    );
  }

  return url.origin;
}

export function readableSupabaseError(error: { message?: string } | null | undefined) {
  const message = error?.message?.trim() || 'Bilinmeyen Supabase hatası';
  if (/<!doctype html|<html/i.test(message)) {
    return 'Supabase API yerine HTML yanıtı alındı. SUPABASE_URL değerini kontrol edin.';
  }
  return message.length > 400 ? `${message.slice(0, 400)}…` : message;
}

export function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY tanımlanmalıdır.');
  }

  client = createClient(normalizeSupabaseUrl(url), serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { 'X-Client-Info': 'dietisyen-site-server' } },
  });
  return client;
}
