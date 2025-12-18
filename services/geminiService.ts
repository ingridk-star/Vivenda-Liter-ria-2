
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhanceReview = async (title: string, author: string, draft: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Atue como o curador da @vivenda.literaria. Melhore esta resenha para o Instagram.
    Livro: "${title}" de ${author}.
    Texto Original: "${draft}"
    
    Retorne o texto polido, poético e acolhedor, seguido de 5 hashtags relevantes.`,
  });
  return response.text;
};

export const getBookRecommendation = async (recentBooks: string[]) => {
  const prompt = recentBooks.length > 0 
    ? `Com base nestes livros que li recentemente: ${recentBooks.join(', ')}. Sugira UM livro que combine com o estilo da @vivenda.literaria. Retorne apenas: Título | Autor | Por que ler`
    : `Sugira um clássico imperdível para quem ama literatura e estética. Retorne: Título | Autor | Por que ler`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
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
        { text: "Identifique o título e o autor deste livro. Retorne apenas: Título | Autor" }
      ]
    },
  });
  
  return response.text;
};
