import admin from 'firebase-admin';

const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'madein-algeria';

if (!admin.apps || admin.apps.length === 0) {
  // Check if we have a service account key in environment
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (serviceAccount) {
    try {
      // Parse the service account JSON from environment variable
      const serviceAccountJson = JSON.parse(serviceAccount);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountJson),
        projectId: projectId,
      });
      console.log('✅ Firebase Admin initialized with service account');
    } catch (error) {
      console.error('❌ Failed to parse Firebase service account:', error);
      // Fallback to emulator mode
      admin.initializeApp({
        projectId: projectId,
      });
      console.warn('⚠️  Falling back to emulator mode');
    }
  } else {
    // For development/testing without credentials
    console.warn('⚠️  No Firebase service account credentials found. Using emulator mode.');
    admin.initializeApp({
      projectId: projectId,
    });
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
