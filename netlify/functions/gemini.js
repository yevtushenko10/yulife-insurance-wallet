const SYSTEM_INSTRUCTION = `You are a friendly, supportive insurance assistant for YuLife — a gamified insurance and wellbeing app.
Your role is to help users understand their policies, guide them through claims, and answer wellbeing questions.
Keep responses concise, warm, and encouraging. Use simple language — avoid jargon.
If asked about specific claim statuses or account details, let the user know they can contact support directly.`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const { message } = JSON.parse(event.body);

    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing message' }) };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: message,
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: response.text }),
    };
  } catch (err) {
    console.error('Gemini error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong. Please try again.' }),
    };
  }
};
