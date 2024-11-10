import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Check if we're adding a new patient
  const isNew = id === "new";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pastProblems, setPastProblems] = useState("");
  const [audioRecordings, setAudioRecordings] = useState([]);
  const [audioURL, setAudioURL] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState({ name: "", email: "" });

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const base64Audio = useRef(null);
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
  const GITHUB_REPO = "smilegupta/test";
  const GITHUB_FILE_PATH = `recordings/${name}-${new Date().toISOString()}.mp3`;

  // Prefill data if editing an existing patient
  useEffect(() => {
    if (!isNew) {
      const storedPatients =
        JSON.parse(localStorage.getItem("patient-list")) || [];
      const patientData = storedPatients.find((patient) => patient.id === id);
      if (patientData) {
        setName(patientData.name || "");
        setEmail(patientData.email || "");
        setPastProblems(patientData.pastProblems || "");
        setAudioRecordings(patientData.audioRecordings || []);
      }
    }
  }, [id, isNew]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setError((prev) => ({
      ...prev,
      name: e.target.value ? "" : "Name is required.",
    }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setError((prev) => ({
      ...prev,
      email: emailRegex.test(e.target.value)
        ? ""
        : "Enter a valid email address.",
    }));
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser doesn't support audio recording.");
      return;
    }
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mpeg" });

        // this to create a URL for the audio file which can be used to play the audio
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);
        audioChunks.current = [];
        stream.getTracks().forEach((track) => track.stop());
        base64Audio.current = await blobToBase64(audioBlob);
      };
      // Start recording
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error accessing audio stream:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError({
        name: !name ? "Name is required." : "",
        email: !email ? "Email is required." : "",
      });
      return;
    }

    let githubFileURL = "";
    if (audioURL) {
      githubFileURL = await uploadToGitHub(base64Audio.current);
    }

    const generatedId = Math.round(Math.random() * 1000).toString();

    const patientData = {
      id: isNew ? generatedId : id,
      name,
      email,
      pastProblems,
      avatar: `https://robohash.org/${
        isNew ? generatedId : id
      }.png?size=200x200`,
      audioRecordings: githubFileURL
        ? [
            ...audioRecordings,
            { url: githubFileURL, time: new Date().toISOString() },
          ]
        : audioRecordings,
    };

    // Store data locally for now
    const storedPatients =
      JSON.parse(localStorage.getItem("patient-list")) || [];
    const updatedPatients = isNew
      ? [...storedPatients, patientData]
      : storedPatients.map((patient) =>
          patient.id === id ? patientData : patient
        );
    localStorage.setItem("patient-list", JSON.stringify(updatedPatients));

    console.log("Submitted data:", patientData);
    navigate("/");
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const uploadToGitHub = async (base64Audio) => {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isNew ? "Add New Patient" : "Edit Patient"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Patient Name
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter patient's name"
              required
            />
            {error.name && (
              <p className="text-red-500 text-sm mt-1">{error.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Patient Email
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter patient's email"
              required
            />
            {error.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Patient Past Problems
            </label>
            <textarea
              value={pastProblems}
              onChange={(e) => setPastProblems(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe any past problems"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Recorded Observations
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-4 py-2 rounded-md text-white ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } transition duration-200`}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>
              {audioURL && (
                <audio controls src={audioURL} className="mt-3">
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
