const SYSTEM_INSTRUCTION = `You are a friendly, supportive insurance assistant for YuLife — a gamified insurance and wellbeing app.
Your role is to help users understand their policies, guide them through claims, and answer wellbeing questions.
Keep responses concise, warm, and encouraging. Use simple language — avoid jargon.
If asked about specific claim statuses or account details, let the user know they can contact support directly.`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message } = JSON.parse(event.body);

    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing message' }) };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ parts: [{ text: message }] }],
      }),
    });

    const data = await res.json();
    console.log('Gemini raw response:', JSON.stringify(data));

    if (!res.ok || data.error) {
      console.error('Gemini API error:', data.error);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `API error: ${data.error?.message || res.status}` }),
      };
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text || "I'm sorry, I couldn't process that. Let's try again! 💙" }),
    };
  } catch (err) {
    console.error('Gemini error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong. Please try again.' }),
    };
  }
};
