import type { PracticeSession } from '@/features/temp-session/types'

const DB_NAME = 'mixed-practice-db'
const DB_VERSION = 1
const STORE_NAME = 'sessions'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('userId', 'userId', { unique: false })
        store.createIndex('expiresAt', 'expiresAt', { unique: false })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function getStore(db: IDBDatabase, mode: IDBTransactionMode = 'readonly') {
  const transaction = db.transaction(STORE_NAME, mode)
  return transaction.objectStore(STORE_NAME)
}

export async function saveSession(session: PracticeSession): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const request = getStore(db, 'readwrite').put(session)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function loadSession(id: string): Promise<PracticeSession | null> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const request = getStore(db).get(id)
    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteSession(id: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const request = getStore(db, 'readwrite').delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function getAllSessions(userId: string): Promise<PracticeSession[]> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const index = getStore(db).index('userId')
    const request = index.getAll(userId)
    request.onsuccess = () => resolve(request.result ?? [])
    request.onerror = () => reject(request.error)
  })
}

export async function clearExpiredSessions(): Promise<void> {
  const db = await openDb()
  const now = Date.now()
  return new Promise((resolve, reject) => {
    const index = getStore(db, 'readwrite').index('expiresAt')
    const range = IDBKeyRange.upperBound(now)
    const request = index.openCursor(range)

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
      if (cursor) {
        cursor.delete()
        cursor.continue()
      } else {
        resolve()
      }
    }
    request.onerror = () => reject(request.error)
  })
}
