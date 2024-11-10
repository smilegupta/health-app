// reading github token from main thread, because it is not possible to read it from service worker
let githubToken = "";
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SET_GITHUB_TOKEN") {
    githubToken = event.data.token;
    console.log("GitHub token received in service worker");
  }
});

//todo: move these indexedDB functions to a separate file in the future
// IndexedDB functions to interact with pending-patients store
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myAppDB", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("pending-patients")) {
        db.createObjectStore("pending-patients", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getPendingPatients = async () => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("pending-patients", "readonly");
    const store = transaction.objectStore("pending-patients");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event);
  });
};

const deletePendingPatient = async (id) => {
  const db = await openDatabase();
  const transaction = db.transaction("pending-patients", "readwrite");
  const store = transaction.objectStore("pending-patients");
  store.delete(id);
};

// Sync event listener to process pending patients
self.addEventListener("sync", async (event) => {
  if (event.tag === "sync-pending-patients") {
    event.waitUntil(syncPendingPatients());
  }
});

// Sync function to process and upload pending patients data
const syncPendingPatients = async () => {
  const pendingPatients = await getPendingPatients();

  for (const patientData of pendingPatients) {
    for (const recording of patientData.audioRecordings) {
      if (recording.isBase64) {
        try {
          // Upload the base64 audio to GitHub and update the recording URL
          const githubFileURL = await uploadToGitHub(
            patientData.name,
            recording.url
          );
          recording.url = githubFileURL;
          recording.isBase64 = false;
        } catch (error) {
          console.error("Failed to upload recording to GitHub:", error);
          return; // Exit if upload fails, will retry on next sync
        }
      }
    }

    // Send updated patient data to main thread to store in LocalStorage
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: "UPDATE_LOCAL_STORAGE",
        patientData,
      });
    });

    // Delete from IndexedDB after syncing
    await deletePendingPatient(patientData.id);
  }
};

// Helper function to upload base64 audio to GitHub
const uploadToGitHub = async (name, base64Audio) => {
  const url = `https://api.github.com/repos/smilegupta/test/contents/recordings/${name}-${new Date().toISOString()}.mp3`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Add audio recording",
        content: base64Audio,
      }),
    });

    if (!response.ok) throw new Error("Failed to upload to GitHub");
    const data = await response.json();
    return data.content.html_url;
  } catch (error) {
    console.error("Error uploading to GitHub:", error);
  }
};