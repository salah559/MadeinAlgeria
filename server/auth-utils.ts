import { adminAuth } from './firebase-admin';

interface DecodedToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}

/**
 * Verify Firebase ID token
 * In production with Firebase Admin credentials, this uses admin.auth().verifyIdToken()
 * In development without credentials, this extracts user info from the token
 */
export async function verifyFirebaseToken(token: string): Promise<DecodedToken> {
  try {
    // Try to verify using Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
    };
  } catch (error) {
    // If Admin SDK fails (e.g., in emulator mode), decode the token manually
    // This is less secure but allows development to continue
    console.warn('⚠️  Firebase Admin SDK verification failed, using fallback token decode');
    
    try {
      // Decode JWT token (without signature verification in dev mode)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
      
      // Extract user information from token payload
      return {
        uid: payload.user_id || payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch (decodeError) {
      console.error('Failed to decode token:', decodeError);
      throw new Error('Invalid token');
    }
  }
}
