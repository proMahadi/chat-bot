export interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

export class GroqClient {
  private apiKey: string;
  private baseUrl = 'https://api.groq.com/openai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(messages: GroqMessage[]): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages,
          temperature: 0.7,
          max_tokens: 2048,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response received';
    } catch (error) {
      console.error('Error calling Groq API:', error);
      throw error;
    }
  }
}