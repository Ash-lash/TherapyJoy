import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

let auth, db;

// Check if we should use mock Firebase
const useMock = process.env.NODE_ENV === 'development' || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY;

if (useMock) {
  console.log("⚠️  Running in development mode without Firebase - using mock implementation");
  
  // Mock Firebase for development
  const mockAuth = {
    verifyIdToken: async (token) => {
      // Mock user for development
      return {
        uid: "test-user-123",
        email: token === "mock-token" ? "test@example.com" : "dev@example.com",
      };
    },
  };

  const mockDb = {
    doc: (path) => ({
      get: async () => ({ exists: false, data: () => ({}) }),
      set: async (data) => true,
      update: async (data) => true,
    }),
    collection: (path) => {
      const chain = {
        doc: (id) => ({
          get: async () => ({ exists: false, data: () => ({}) }),
          set: async () => true,
        }),
        where: () => chain,
        orderBy: () => chain,
        limit: () => chain,
        get: async () => ({ docs: [] }),
        add: async () => ({ id: "mock-id" }),
      };
      return chain;
    },
  };

  auth = mockAuth;
  db = mockDb;
  console.log("✅ Mock Firebase initialized for development");
} else {

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  auth = admin.auth();
  db = admin.firestore();
  console.log("✅ Real Firebase initialized");
}

export { admin, auth, db };
