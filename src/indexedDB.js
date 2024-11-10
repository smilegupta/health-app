export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myAppDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("pending-patients")) {
        const store = db.createObjectStore("pending-patients", {
          keyPath: "id",
        });

        store.createIndex("name", "name", { unique: false });
        store.createIndex("email", "email", { unique: true });
        store.createIndex("pastProblems", "pastProblems", { unique: false });
        store.createIndex("audioRecordings", "audioRecordings", {
          unique: false,
        });
        store.createIndex("avatar", "avatar", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const savePendingPatient = async (patientData) => {
  const db = await openDatabase();
  const transaction = db.transaction("pending-patients", "readwrite");
  const store = transaction.objectStore("pending-patients");
  store.put(patientData);
};

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

export const deletePendingPatient = async (id) => {
  const db = await openDatabase();
  const transaction = db.transaction("pending-patients", "readwrite");
  const store = transaction.objectStore("pending-patients");
  store.delete(id);
};
