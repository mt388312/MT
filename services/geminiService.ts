import { GoogleGenAI, Type } from "@google/genai";
import { Actor, ActorType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateLevelFromPrompt = async (prompt: string): Promise<Actor[]> => {
  const systemInstruction = `
    You are a Level Designer for a game engine. 
    The user will describe a scene (e.g., "A dungeon with a locked door and a guard").
    You must return a JSON object containing an array of actors to populate the scene.
    
    Coordinate System:
    x: 0 to 800 (Canvas width approx)
    y: 0 to 600 (Canvas height approx)
    z: 0 to 100 (Height/Layering)
    scale: 0.5 to 5 (Size)
    rotation: 0 to 360 (Degrees)
    
    Available Types: 
    - StaticMesh (Generic objects, walls, floors)
    - PointLight (Light sources)
    - Camera
    - PlayerStart (Spawn point)
    - Blueprint (Generic logic)
    - Character (The playable character or NPCs)
    - Door (Interactive door that opens/closes)

    Rules:
    1. Use "StaticMesh" for generic objects.
    2. Use "Character" for the main player or NPCs. **Always include at least one Character so the user can control it.**
    3. Use "Door" for doors.
    4. Colors should be hex codes appropriate for the object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            actors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING, enum: [
                    'StaticMesh', 'PointLight', 'Camera', 'PlayerStart', 'Blueprint', 'Character', 'Door'
                  ]},
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  rotation: { type: Type.NUMBER },
                  scale: { type: Type.NUMBER },
                  color: { type: Type.STRING },
                },
                required: ['name', 'type', 'x', 'y', 'rotation', 'scale', 'color']
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const parsed = JSON.parse(jsonText);
    
    // Map raw response to our internal Actor type
    return parsed.actors.map((a: any) => ({
      id: generateId(),
      name: a.name,
      type: a.type as ActorType,
      transform: {
        x: a.x,
        y: a.y,
        z: 0,
        rotation: a.rotation,
        scale: a.scale
      },
      color: a.color,
      selected: false
    }));

  } catch (error) {
    console.error("Gemini Level Gen Error:", error);
    throw error;
  }
};

export const generateActorScript = async (actorName: string, behaviorDescription: string, language: string = 'C++'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a ${language} script/code for an actor named "${actorName}". Behavior: ${behaviorDescription}. Keep it short and concise, suitable for a game engine tooltip or preview. Return ONLY code.`,
    });
    return response.text || "// No script generated.";
  } catch (error) {
    console.error("Gemini Script Gen Error:", error);
    return "// Error generating script.";
  }
};