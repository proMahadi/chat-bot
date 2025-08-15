export interface GroqMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
  error?: {
    message: string;
    type: string;
  };
}

export class GroqClient {
  private apiKey: string;
  private baseUrl = "https://api.groq.com/openai/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(messages: GroqMessage[]): Promise<string> {
    try {
      console.log("Making request to Groq with messages:", messages.length);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // Updated to valid model
          messages,
          temperature: 0.7,
          max_tokens: 2048,
          stream: false,
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Groq API error response:", errorData);

        throw new Error(
          `Groq API error: ${response.status} ${response.statusText}. ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data: GroqResponse = await response.json();
      console.log("Groq response received successfully");

      if (!data.choices || data.choices.length === 0) {
        throw new Error("No choices returned from Groq API");
      }

      return data.choices[0]?.message?.content || "No response received";
    } catch (error) {
      console.error("Error calling Groq API:", error);

      // More specific error messages
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error: Unable to connect to Groq API");
      }

      throw error;
    }
  }
}
