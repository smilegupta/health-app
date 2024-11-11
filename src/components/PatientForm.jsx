import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InputField from "./InputField";
import RecordingControls from "./RecordingControls";
import { blobToBase64 } from "src/utils/blobToBase64";
import { useUser } from "src/contexts/UserContext";

import { savePendingPatient } from "src/indexedDB";

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [patient, setPatient] = useState({
    name: "",
    email: "",
    pastProblems: "",
    recordings: [],
  });
  const [audioURL, setAudioURL] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [errors, setErrors] = useState({});
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const base64Audio = useRef(null);
  const { user } = useUser();

  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
  const GITHUB_REPO = "smilegupta/test";
  const GITHUB_FILE_PATH = `recordings/${
    patient.name
  }-${new Date().toISOString()}.mp3`;

  useEffect(() => {
    if (!isNew) loadPatientData();
  }, [id, isNew, user]);

  const loadPatientData = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `https://ecictj5926.execute-api.ap-south-1.amazonaws.com/dev/patients/${id}?caregiverId=${user.sub}`
      );
      if (!response.ok) throw new Error("Failed to fetch patient");
      const data = await response.json();
      setPatient((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Error fetching patient:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setPatient((prev) => ({ ...prev, [field]: value }));
    if (field === "name" || field === "email") validateField(field, value);
  };

  const validateField = (field, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorMessages = {
      name: "Name is required.",
      email: "Enter a valid email address.",
    };

    setErrors((prev) => ({
      ...prev,
      [field]:
        field === "email" && !emailRegex.test(value)
          ? errorMessages.email
          : field === "name" && !value
          ? errorMessages.name
          : "",
    }));
  };

  const handleRecording = async (start = true) => {
    if (start) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setIsRecording(true);
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/mpeg",
          });
          setAudioURL(URL.createObjectURL(audioBlob));
          base64Audio.current = await blobToBase64(audioBlob);
          audioChunks.current = [];
          stream.getTracks().forEach((track) => track.stop());
        };
        mediaRecorderRef.current.start();
      } catch (error) {
        console.error("Error accessing audio stream:", error);
      }
    } else {
      setIsRecording(false);
      mediaRecorderRef.current?.stop();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.name || errors.email) return;

    const generatedId = isNew
      ? Math.round(Math.random() * 1000).toString()
      : id;
    const patientData = {
      ...patient,
      caregiverId: user.sub,
      avatar: `https://robohash.org/${generatedId}.png?size=200x200`,
    };

    if (navigator.onLine) {
      patientData.recordings = await uploadRecording(
        audioURL,
        patientData.recordings
      );
      await savePatientData(isNew ? "POST" : "PUT", patientData);
    } else {
      await savePendingPatient({ ...patientData, id: generatedId });
      alert("Data saved offline and will sync when online.");
    }

    navigate("/");
  };

  const uploadRecording = async (audioURL, recordings) => {
    if (audioURL) {
      try {
        const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Add audio recording",
            content: base64Audio.current,
          }),
        });
        if (!response.ok) throw new Error("Failed to upload to GitHub");
        const data = await response.json();
        return [
          ...recordings,
          {
            url: data.content.html_url,
            time: new Date().toISOString(),
            isBase64: false,
          },
        ];
      } catch (error) {
        console.error("Error uploading to GitHub:", error);
      }
    }
    return recordings;
  };

  const savePatientData = async (method, data) => {
    const url = `https://ecictj5926.execute-api.ap-south-1.amazonaws.com/dev/patients${
      isNew ? "" : `/${id}`
    }`;

    let formattedData = { ...data };

    if (!isNew) {
      // remove patientId
      delete formattedData.patientId;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
      if (!response.ok) throw new Error("Failed to save patient data");
      await response.json();
    } catch (error) {
      console.error(`Error ${isNew ? "adding" : "updating"} patient:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isNew ? "Add New Patient" : "Edit Patient"}
        </h2>
        <form onSubmit={handleSubmit}>
          {["name", "email", "pastProblems"].map((field, index) => (
            <InputField
              key={index}
              label={`Patient ${
                field.charAt(0).toUpperCase() + field.slice(1)
              }`}
              type={field === "email" ? "email" : "text"}
              value={patient[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              error={errors[field]}
              isTextArea={field === "pastProblems"}
              readOnly={!isNew && field === "email"}
            />
          ))}
          <RecordingControls
            isRecording={isRecording}
            audioURL={audioURL}
            onStart={() => handleRecording(true)}
            onStop={() => handleRecording(false)}
            recordings={patient.recordings}
          />
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
