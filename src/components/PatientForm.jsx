import { useState, useRef } from "react";

const PatientForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pastProblems, setPastProblems] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState({ name: "", email: "" });

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // Form field change handlers
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (e.target.value.trim() === "") {
      setError((prev) => ({ ...prev, name: "Name is required." }));
    } else {
      setError((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(e.target.value)) {
      setError((prev) => ({ ...prev, email: "Enter a valid email address." }));
    } else {
      setError((prev) => ({ ...prev, email: "" }));
    }
  };

  // Audio recording handlers
  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser doesn't support audio recording.");
      return;
    }

    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      // Event listeners for recording
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      // Event listener for when recording stops
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mpeg" });

        // this to create a URL for the audio file which can be used to play the audio
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);
        audioChunks.current = [];

        stream.getTracks().forEach((track) => track.stop());

        //todo: Add logic to upload the audio file to a github
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError({
        name: !name ? "Name is required." : "",
        email: !email ? "Email is required." : "",
      });
      return;
    }

    // Add logic to submit form data and audio URL
    console.log({ name, email, pastProblems, audioURL });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Patient Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
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
              Email
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
              Past Problems
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
              Audio Recording
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
