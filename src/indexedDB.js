export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myAppDB", 2);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Object store for pending patients
      if (!db.objectStoreNames.contains("pending-patients")) {
        const pendingStore = db.createObjectStore("pending-patients", {
          keyPath: "id",
        });
        pendingStore.createIndex("name", "name", { unique: false });
        pendingStore.createIndex("email", "email", { unique: true });
        pendingStore.createIndex("pastProblems", "pastProblems", { unique: false });
        pendingStore.createIndex("audioRecordings", "audioRecordings", {
          unique: false,
        });
        pendingStore.createIndex("avatar", "avatar", { unique: false });
      }

      // New object store for cached patients from the API
      if (!db.objectStoreNames.contains("cached-patients")) {
        const cacheStore = db.createObjectStore("cached-patients", {
          keyPath: "id",
        });
        cacheStore.createIndex("name", "name", { unique: false });
        cacheStore.createIndex("email", "email", { unique: true });
        cacheStore.createIndex("pastProblems", "pastProblems", { unique: false });
        cacheStore.createIndex("avatar", "avatar", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Function to save a pending patient (for offline operations)
export const savePendingPatient = async (patientData) => {
  const db = await openDatabase();
  const transaction = db.transaction("pending-patients", "readwrite");
  const store = transaction.objectStore("pending-patients");
  store.put(patientData);
};

// Function to get all pending patients
export const getPendingPatients = async () => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("pending-patients", "readonly");
    const store = transaction.objectStore("pending-patients");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event);
  });
};

// Function to delete a pending patient
export const deletePendingPatient = async (id) => {
  const db = await openDatabase();
  const transaction = db.transaction("pending-patients", "readwrite");
  const store = transaction.objectStore("pending-patients");
  store.delete(id);
};

// Function to save the main cached patients (for API fallback)
export const saveCachedPatients = async (patients) => {
  const db = await openDatabase();
  const transaction = db.transaction("cached-patients", "readwrite");
  const store = transaction.objectStore("cached-patients");

  // Clear old data before adding new data
  await store.clear();

  patients.forEach((patient) => {
    store.put(patient);
  });
};

// Function to get all cached patients (fallback for offline)
export const getCachedPatients = async () => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("cached-patients", "readonly");
    const store = transaction.objectStore("cached-patients");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event);
  });
};

// Optional: Function to clear cached patients if needed
export const clearCachedPatients = async () => {
  const db = await openDatabase();
  const transaction = db.transaction("cached-patients", "readwrite");
  const store = transaction.objectStore("cached-patients");
  await store.clear();
};
