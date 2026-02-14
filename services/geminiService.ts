
import { GoogleGenAI } from "@google/genai";

export async function transformToScholar(
  base64Image: string,
  gender: string,
  specialtyName: string,
  tools: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Transform the person in the attached photo into a high-quality, vibrant 2D cartoon illustration 
    of a famous Muslim scholar from the Islamic Golden Age.
    
    CRITICAL REQUIREMENT: You MUST preserve the EXACT facial features, bone structure, and unique recognizable identity of the person in the original photo. The person should be immediately recognizable. Do not use a generic face.
    
    Gender: ${gender === 'ذكر' ? 'Male' : 'Female'}.
    Specialty: ${specialtyName}.
    Attire: Traditional historical Islamic scholarly robes, headcover (turban for male, hijab/headscarf for female) in rich colors like teal, gold, or deep red.
    Action: The character should be holding ${tools}.
    Setting: A magnificent ancient library (House of Wisdom style) with bookshelves, scrolls, and warm lighting.
    Style: Professional digital art / high-end animation style. Clean lines, expressive but realistic facial proportions that match the original photo perfectly. 
    
    NO text in the image. High resolution.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1], // Remove prefix
              mimeType: 'image/jpeg',
            },
          },
          { text: prompt },
        ],
      },
    });

    let imageUrl = '';
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error("لم يتم استلام صورة من الذكاء الاصطناعي");
    }

    return imageUrl;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
