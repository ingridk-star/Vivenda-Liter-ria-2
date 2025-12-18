
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini API client with the environment variable API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhanceReview = async (title: string, author: string, draft: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Melhore esta resenha literária para o Instagram @vivenda.literaria. 
    O livro é "${title}" de ${author}.
    Rascunho: "${draft}"
    
    Ajuste o tom para ser elegante, acolhedor e poético. Mantenha as opiniões do autor.`,
  });
  return response.text;
};

export const generateInstagramCaption = async (review: string, title: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Crie uma legenda cativante para o Instagram do @vivenda.literaria baseada nesta resenha do livro "${title}":
    Resenha: "${review}"
    
    Inclua emojis literários e hashtags relevantes. O estilo deve ser sofisticado e convidativo.`,
  });
  return response.text;
};

export const getBookInfoFromCover = async (base64Image: string) => {
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image.split(',')[1],
    },
  };
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        imagePart,
        { text: "Identifique o título e o autor deste livro na imagem. Retorne apenas o título e autor no formato: Título | Autor" }
      ]
    },
  });
  
  return response.text;
};
