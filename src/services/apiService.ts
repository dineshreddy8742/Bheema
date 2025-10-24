
const API_BASE_URL = "https://chintuvignu17-rural-smart-kisan.hf.space";

export const startSession = async (userId: string, language: string) => {
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("language", language);

  const response = await fetch(`${API_BASE_URL}/api/agent/start-session`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to start session");
  }

  return response.json();
};

export const executeTask = async (
  sessionId: string,
  taskType: string,
  userInput: string | null,
  language: string,
  file: File | null
) => {
  const formData = new FormData();
  formData.append("session_id", sessionId);
  formData.append("task_type", taskType);
  if (userInput) {
    formData.append("user_input", userInput);
  }
  formData.append("language", language);
  if (file) {
    formData.append("file", file);
  }

  const response = await fetch(`${API_BASE_URL}/api/agent/execute-task`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to execute task");
  }

  return response.json();
};

export const handleVoiceCommand = async (
  sessionId: string,
  audioBlob: Blob,
  language: string
) => {
  const formData = new FormData();
  formData.append("session_id", sessionId);
  formData.append("audio_file", audioBlob, "voice.webm");
  formData.append("language", language);

  const response = await fetch(`${API_BASE_URL}/api/agent/voice-command`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to handle voice command");
  }

  return response.json();
};
