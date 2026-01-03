import { GoogleGenAI, Type } from "@google/genai";
import { GenerationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateOSCode = async (prompt: string): Promise<GenerationResponse> => {
  const modelId = "gemini-3-flash-preview";
  
  const systemInstruction = `
    Eres un ingeniero experto en Frontend y un diseñador creativo de UI/UX.
    Tu objetivo es crear interfaces de "Sistemas Operativos" simulados utilizando un solo archivo HTML que contenga todo el CSS y JS necesario.
    
    Reglas:
    1. El código debe ser HTML5 válido.
    2. Debe incluir CSS (en una etiqueta <style>) para que se vea visualmente impresionante y acorde al prompt del usuario.
    3. Debe incluir JavaScript (en una etiqueta <script>) para hacer la interfaz interactiva.
    4. Funcionalidades esperadas (simuladas):
       - Una barra de tareas o dock.
       - Ventanas que se puedan arrastrar (drag and drop básico).
       - Iconos en el escritorio.
       - Menú de inicio o lanzador de aplicaciones.
       - Reloj funcional.
    5. No uses librerías externas que requieran descarga (como React o Vue) dentro del HTML generado. Usa Vanilla JS. Puedes usar fuentes de Google Fonts o iconos SVG inline.
    6. El diseño debe ser responsivo o adaptarse al viewport completo (width: 100vw, height: 100vh).
    7. Sé creativo. Si el usuario pide "Cyberpunk", usa neones y colores oscuros. Si pide "Windows 95", usa grises y bordes biselados.

    Retorna la respuesta estrictamente en formato JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Un nombre creativo para el SO" },
            description: { type: Type.STRING, description: "Una breve descripción de las características" },
            html: { type: Type.STRING, description: "El código completo HTML/CSS/JS" }
          },
          required: ["name", "description", "html"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as GenerationResponse;

  } catch (error) {
    console.error("Error generating OS:", error);
    throw error;
  }
};
