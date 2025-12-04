export function decodeToken(token) {
  try {
    const payload = token.split('.')[1]; 
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}
