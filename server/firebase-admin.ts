import * as admin from 'firebase-admin';

let app: admin.app.App;

if (admin.apps.length === 0) {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'madein-algeria';
  
  app = admin.initializeApp({
    projectId: projectId,
  });
} else {
  app = admin.apps[0]!;
}

export const adminAuth = admin.auth(app);
export const adminDb = admin.firestore(app);
