// Simple environment validation utility.
export function validateEnv() {
  const env = process.env.NEXT_PUBLIC_APP_ENV;
  if (!env) {
    throw new Error('NEXT_PUBLIC_APP_ENV is not defined');
  }
  const allowed = ['mock', 'development', 'production'];
  if (!allowed.includes(env)) {
    throw new Error(`Invalid NEXT_PUBLIC_APP_ENV: ${env}`);
  }
  return env;
}