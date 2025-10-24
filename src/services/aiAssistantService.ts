import axios from 'axios';

const API_URL = 'https://chintuvignu17-rural-smart-kisan.hf.space';

export interface AIMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isVoice?: boolean;
  confidence?: number;
  suggestions?: string[];
  detectedLanguage?: string;
}

export interface AIResponse {
  message: string;
  confidence: number;
  category: string;
  suggestions?: string[];
  actionItems?: string[];
  relatedTopics?: string[];
}

export interface FarmingContext {
  location?: string;
  cropType?: string;
  season?: string;
  farmSize?: string;
  soilType?: string;
}

export interface RecognizedIntent {
  intent: string;
  entities: Record<string, any>;
}

import { dynamicWorkflowEngine, DynamicWorkflow } from './dynamicWorkflowEngine';

import { translateText } from './translationService';

class AIAssistantService {
  private farmingContext: FarmingContext = {};

  setContext(context: FarmingContext) {
    this.farmingContext = { ...this.farmingContext, ...context };
  }

  private async getGeminiWorkflow(prompt: string, languageCode: string, file?: File): Promise<DynamicWorkflow | null> {
    // 1. Translate the user's prompt to English if it's not already in English.
    let translatedPrompt = prompt;
    if (languageCode !== 'en') {
      translatedPrompt = await translateText(prompt, 'en', languageCode);
    }

    // In a real implementation, we would not import the schema directly,
    // but rather have a more sophisticated way of providing the UI schema to the model.
    const uiSchema = await import('@/lib/ui-schema.json');

    const systemPrompt = `
      You are an expert at using a web application for farming assistance. Your goal is to create a step-by-step workflow to accomplish a user's task.
      You will be given a user's prompt and a JSON schema of the application's UI.
      The schema describes the pages and the elements on them.
      You must return a JSON object representing the workflow.
      The workflow should be a series of steps, each with an action and a target.
      Possible actions are: 'navigate', 'click', 'fill-field', 'speak', 'ask_user', 'upload_file', 'take_photo', 'check_status'.

      IMPORTANT: All messages and responses in the workflow must be in the user's language: ${languageCode}.
      If the user is speaking in a non-English language, translate all speak actions and messages to that language.
      The application supports multiple languages: English (en), Hindi (hi), Telugu (te), Tamil (ta), Kannada (kn), Marathi (mr).

      Here is the UI schema:
      ${JSON.stringify(uiSchema.default, null, 2)}
    `;

    try {
      const payload = {
        system_prompt: systemPrompt,
        user_prompt: translatedPrompt,
        ui_schema: uiSchema.default,
        language: languageCode,
      };

      const response = await axios.post(`${API_URL}/api/agent/generate-workflow`, payload);
      const parsedResponse = response.data;
      const workflow: DynamicWorkflow = {
        intent: "dynamic_workflow",
        language: languageCode,
        translated_input: translatedPrompt,
        steps: parsedResponse.workflow || [],
      };

      return workflow;
    } catch (error) {
      console.error('Error calling backend for Gemini Workflow:', error);
      return null;
    }
  }

  async generateAndExecuteWorkflow(message: string, languageCode: string, file?: File): Promise<AIMessage | null> {
    const workflow = await this.getGeminiWorkflow(message, languageCode, file);

    if (workflow) {
        return dynamicWorkflowEngine.startWorkflow(workflow);
    }

    return null;
  }

  private toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });


  async recognizeIntent(message: string): Promise<RecognizedIntent> {
    const lowerCaseMessage = message.toLowerCase().trim();

    // Simple greetings and conversational queries
    if ([/^hi$/, /^hello$/, /^hey$/].some(regex => regex.test(lowerCaseMessage))) {
      return { intent: 'general_query', entities: {} };
    }

    // Specific command to run a saved workflow
    if (lowerCaseMessage.startsWith('run workflow')) {
      return { intent: 'run_workflow', entities: { workflowName: lowerCaseMessage.replace(/^run workflow /, '') } };
    }

    // For everything else, assume it's a task that requires a dynamic workflow
    return { intent: 'dynamic_workflow', entities: {} };
  }

  async startSession(userId: string, initialTask: string, language: string = 'en') {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('initial_task', initialTask);
    formData.append('language', language);

    console.log("API_URL:", API_URL);
    const response = await axios.post(`${API_URL}/api/agent/start-session`, formData);
    return response.data;
  }

  async executeTask(sessionId: string, taskType: string, userInput: string, language: string = 'en', file?: File) {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('task_type', taskType);
    formData.append('user_input', userInput);
    formData.append('language', language);
    if (file) {
      formData.append('file', file);
    }

    const response = await axios.post(`${API_URL}/api/agent/execute-task`, formData);
    return response.data;
  }

  async processVoiceInput(sessionId: string, audioBlob: Blob, language: string = 'en') {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('audio_file', audioBlob, 'voice.webm');
    formData.append('language', language);

    const response = await axios.post(`${API_URL}/api/agent/voice-command`, formData);
    return response.data;
  }

  async getAIResponse(message: string, conversationHistory: AIMessage[] = []): Promise<AIResponse> {
    // This method needs to be adapted to the new backend.
    // For now, it will call the executeTask endpoint with a generic task type.
    // A session ID would be required here.
    console.warn("getAIResponse needs a session ID to work correctly.");
    return this.executeTask("default-session", "general_query", message).then(res => ({
        message: res.actions[0]?.message || "No response",
        confidence: 0.9,
        category: "general"
    }));
  }
}

export const aiAssistantService = new AIAssistantService();
