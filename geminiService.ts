
import { GoogleGenAI, Type } from "@google/genai";
import { AuditResults, RiskLevel } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const AUDIT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    riskScore: { type: Type.NUMBER, description: "0-100 score of overall compliance risk (0=safe, 100=critical)" },
    riskLevel: { type: Type.STRING, description: "Low, Medium, or High" },
    summary: { type: Type.STRING },
    metadata: {
      type: Type.OBJECT,
      properties: {
        agentName: { type: Type.STRING },
        customerName: { type: Type.STRING },
        duration: { type: Type.STRING, description: "e.g. 05:24" },
        department: { type: Type.STRING },
        callDate: { type: Type.STRING }
      },
      required: ["agentName", "customerName", "duration", "department", "callDate"]
    },
    issues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING },
          excerpt: { type: Type.STRING },
          explanation: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          startTime: { type: Type.NUMBER, description: "Start time of this violation in seconds from beginning of audio" },
          endTime: { type: Type.NUMBER, description: "End time of this violation in seconds" }
        },
        required: ["id", "category", "excerpt", "explanation", "confidence", "startTime", "endTime"]
      }
    },
    transcript: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: { type: Type.STRING },
          text: { type: Type.STRING },
          timestamp: { type: Type.STRING },
          issueId: { type: Type.STRING, description: "Optional ID linking to an issue found in this segment" }
        },
        required: ["speaker", "text", "timestamp"]
      }
    }
  },
  required: ["riskScore", "riskLevel", "summary", "issues", "transcript", "metadata"]
};

export const analyzeCallTranscript = async (text: string): Promise<AuditResults> => {
  const model = "gemini-3-flash-preview";

  const response = await ai.models.generateContent({
    model,
    contents: `Analyze the following insurance sales conversation for compliance violations and mis-selling practices at Bajaj Life Insurance. 
    Focus on:
    1. Guaranteed return claims.
    2. Omission of risks.
    3. Failure to disclose mandatory policy details.
    4. Misleading statements.
    5. High-pressure sales tactics.
    6. Misrepresentation of benefits.

    Transcript:
    ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: AUDIT_SCHEMA
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    data.issues = data.issues.map((i: any) => ({ ...i, status: 'pending' }));
    return data as AuditResults;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("Invalid response format from AI");
  }
};

export const analyzeAudioBuffer = async (audioBase64: string, mimeType: string): Promise<AuditResults> => {
  const model = "gemini-3-flash-preview";

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            data: audioBase64,
            mimeType: mimeType
          }
        },
        {
          text: `You are an insurance compliance auditor for Bajaj Life Insurance. Listen to this call and identify potential mis-selling or regulatory violations. Provide a structured audit report in JSON including metadata (agent name, duration), risk score, risk level, summary, issues detected (with precise startTime and endTime in seconds), and a full speaker-labeled transcript with timestamps.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: AUDIT_SCHEMA
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    data.issues = data.issues.map((i: any) => ({ ...i, status: 'pending' }));
    return data as AuditResults;
  } catch (error) {
    console.error("Failed to parse Gemini audio response", error);
    throw new Error("Invalid response format from AI audio analysis");
  }
};
