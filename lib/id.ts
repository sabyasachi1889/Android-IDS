export function uid() {
  // Not cryptographically secure; adequate for local log IDs
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
