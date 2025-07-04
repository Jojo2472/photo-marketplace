import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

// Function to sign a JWT with a 7-day expiry
export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Function to verify and decode a JWT
export function getTokenData(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Alias for clarity in middleware usage
export const verifyToken = getTokenData;



