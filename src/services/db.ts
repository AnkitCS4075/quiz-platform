import { openDB } from 'idb';
import { QuizAttempt } from '../types/quiz';

const dbName = 'quizPlatformDB';
const storeName = 'quizAttempts';

export const initDB = async () => {
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    },
  });
  return db;
};

export const saveQuizAttempt = async (attempt: QuizAttempt) => {
  const db = await initDB();
  await db.add(storeName, attempt);
};

export const getQuizAttempts = async (): Promise<QuizAttempt[]> => {
  const db = await initDB();
  return db.getAll(storeName);
}; 