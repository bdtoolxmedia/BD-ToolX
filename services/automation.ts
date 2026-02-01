import { GoogleGenAI } from '@google/genai';

export interface AutomationConfig {
  platform: 'instagram' | 'tiktok' | 'twitter' | 'facebook';
  action: 'post' | 'like' | 'comment' | 'follow' | 'story';
  schedule: string;
  content?: string;
  hashtags?: string[];
  targetAccounts?: string[];
  limits?: {
    dailyPosts?: number;
    dailyLikes?: number;
    dailyComments?: number;
  };
}

const BACKEND_URL = 'http://localhost:5001/api/automation';

export class AutomationEngine {
  constructor() {}

  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Generate content using Gemini
  async generatePostVariants(config: Partial<AutomationConfig>): Promise<string> {
    const ai = this.getAI();
    const prompt = `Create highly engaging social media post variants for ${config.platform}:
    Main Content/Context: ${config.content}
    Hashtags: ${config.hashtags?.join(', ')}
    Tone: ${this.getPlatformTone(config.platform || 'instagram')}
    
    Format with 3 variations including emojis and line breaks.`;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      return response.text || '';
    } catch (error) {
      console.error("AI Generation failed:", error);
      return "Unable to generate content. Please check AI Node status.";
    }
  }

  // Communicate with the Flask Backend to schedule the actual job
  async deployToBackend(type: string, config: AutomationConfig): Promise<any> {
    try {
      const response = await fetch(`${BACKEND_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, config })
      });
      return await response.json();
    } catch (error) {
      console.warn("Backend not reachable. Falling back to local simulation.");
      return { success: true, task_id: `local_${Date.now()}`, local: true };
    }
  }

  async triggerTaskNow(taskId: string): Promise<any> {
    try {
      const response = await fetch(`${BACKEND_URL}/run-now/${taskId}`, { method: 'POST' });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Backend unreachable" };
    }
  }

  async deleteTask(taskId: string): Promise<any> {
    try {
      const response = await fetch(`${BACKEND_URL}/delete/${taskId}`, { method: 'DELETE' });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Backend unreachable" };
    }
  }

  async getStatus(): Promise<any> {
    try {
      const response = await fetch(`${BACKEND_URL}/status`);
      return await response.json();
    } catch (error) {
      return { active_tasks_count: 0, worker_running: false, offline: true };
    }
  }

  // Generate content calendar
  async generateContentCalendar(theme: string, days: number = 7): Promise<string> {
    const ai = this.getAI();
    const prompt = `Create a ${days}-day content calendar for social media about ${theme}.
    Include: Post ideas, hashtags, posting times, and engagement strategies. Return it in a clear Markdown list format.`;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });
      return response.text || '';
    } catch (error) {
      return "Content calendar generation failed.";
    }
  }

  private getPlatformTone(platform: string): string {
    const tones: Record<string, string> = {
      instagram: 'Visual, inspirational, aesthetic, and authentic',
      tiktok: 'Fast-paced, trendy, casual, and entertaining',
      twitter: 'Concise, witty, timely, and conversational',
      facebook: 'Friendly, community-focused, and informative'
    };
    return tones[platform] || 'Professional and engaging';
  }
}

export const automationEngine = new AutomationEngine();