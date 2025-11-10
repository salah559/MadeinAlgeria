import admin from 'firebase-admin';

const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'madein-algeria';

if (!admin.apps || admin.apps.length === 0) {
  admin.initializeApp({
    projectId: projectId,
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
