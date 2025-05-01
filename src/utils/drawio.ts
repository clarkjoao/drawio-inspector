export function generateDrawioId(prefix = "id") {
  const suffix = Math.random().toString(36).substring(2, 10);
  return `${prefix}-${Date.now()}-${suffix}`;
}
