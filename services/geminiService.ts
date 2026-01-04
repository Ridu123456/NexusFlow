
import { GoogleGenAI, Type } from "@google/genai";
import { RouteOption, TransportMode, UserProfile, RouteSegment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-3-flash-preview';

export const getSmartRoutes = async (
  origin: string,
  destination: string,
  preferences: string[]
): Promise<RouteOption[]> => {
  if (!process.env.API_KEY) {
    return [
      {
        id: '1',
        mode: TransportMode.WALKING,
        segments: [
          { mode: TransportMode.WALKING, duration: '4 mins', instruction: 'Walk 120m to Central Metro Station' },
          { mode: TransportMode.METRO, duration: '18 mins', instruction: 'Take Blue Line towards Terminal 3' },
          { mode: TransportMode.AUTO, duration: '6 mins', instruction: 'Exit Gate 2 and take Auto to Destination' }
        ],
        duration: '28 mins',
        cost: '₹45',
        comfortLevel: 'Medium',
        summary: 'Walk + Metro + Auto'
      },
      {
        id: '2',
        mode: TransportMode.CAB,
        segments: [{ mode: TransportMode.CAB, duration: '22 mins', instruction: 'Direct Door-to-Door Cab ride' }],
        duration: '22 mins',
        cost: '₹210',
        comfortLevel: 'High',
        summary: 'Direct Cab'
      }
    ];
  }

  try {
    const prompt = `
      Create 3 distinct urban travel routes from "${origin}" to "${destination}".
      Preferences: ${preferences.join(', ')}.
      
      STRICT MULTIMODE RULES:
      1. Combine different modes (Walk, Metro, Bus, Auto, Cab) for the most efficient path.
      2. If a segment is < 150 meters, it MUST be "WALKING".
      3. For each segment, provide a CLEAR instruction including the transition point (e.g., "Walk 100m to Station X").
      
      Return JSON:
      - duration: total time
      - cost: total cost
      - comfortLevel: "High", "Medium", "Low"
      - summary: brief mode chain (e.g. "Walk → Metro → Auto")
      - segments: array of { mode: string, duration: string, instruction: string }
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              duration: { type: Type.STRING },
              cost: { type: Type.STRING },
              comfortLevel: { type: Type.STRING },
              summary: { type: Type.STRING },
              segments: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    mode: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    instruction: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      },
    });

    const data = JSON.parse(response.text || '[]');
    return data.map((route: any, index: number) => ({
      ...route,
      id: `gen-${index}`,
      mode: route.segments[0]?.mode || TransportMode.WALKING
    }));
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const findNearbyMatches = async (destination: string, mode: string): Promise<UserProfile[]> => {
  if (!process.env.API_KEY) {
    return [
      { id: 'u1', name: 'Alex Johnson', avatar: 'https://picsum.photos/50/50?random=1', rating: 4.8, destination },
      { id: 'u2', name: 'Sarah Lee', avatar: 'https://picsum.photos/50/50?random=2', rating: 4.9, destination },
    ];
  }
  try {
     const prompt = `Generate 3 fictional user profiles who are currently nearby and traveling to "${destination}" using "${mode}".`;
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              destination: { type: Type.STRING },
            },
          },
        },
      },
    });
    const data = JSON.parse(response.text || '[]');
    return data.map((user: any, idx: number) => ({ ...user, avatar: `https://picsum.photos/50/50?random=${idx + 10}` }));
  } catch (error) { return []; }
};

export const findScheduledMatches = async (destination: string, timeSlot: string): Promise<UserProfile[]> => {
  if (!process.env.API_KEY) {
    return [
      { id: 's1', name: 'James Wilson', avatar: 'https://picsum.photos/50/50?random=5', rating: 4.7, destination, scheduledTime: timeSlot },
      { id: 's2', name: 'Emily Chen', avatar: 'https://picsum.photos/50/50?random=6', rating: 5.0, destination, scheduledTime: timeSlot },
    ];
  }
  try {
     const prompt = `Generate 3 fictional users for "${destination}" at "${timeSlot}".`;
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              destination: { type: Type.STRING },
              scheduledTime: { type: Type.STRING },
            },
          },
        },
      },
    });
    const data = JSON.parse(response.text || '[]');
    return data.map((user: any, idx: number) => ({ ...user, avatar: `https://picsum.photos/50/50?random=${idx + 20}` }));
  } catch (error) { return []; }
};

export const getPlaceSuggestions = async (query: string): Promise<string[]> => {
  if (!query || query.length < 3) return [];
  if (!process.env.API_KEY) return [`${query} Central`, `${query} Park`];
  try {
    const prompt = `List 5 location names matching "${query}".`;
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (e) { return []; }
};
