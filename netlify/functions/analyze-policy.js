exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const { pdfText, policyName } = JSON.parse(event.body);

    if (!pdfText) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing pdfText' }) };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `Analyze this insurance policy document for "${policyName}" and respond ONLY with valid JSON (no markdown, no code blocks):
{
  "summary": "One sentence describing what this policy covers",
  "benefits": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"],
  "exclusions": ["exclusion 1", "exclusion 2", "exclusion 3"]
}

Keep each benefit/exclusion under 6 words. Extract real info from the document.

Policy document:
${pdfText.substring(0, 12000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    let result;
    try {
      const cleaned = response.text.replace(/```json|```/g, '').trim();
      result = JSON.parse(cleaned);
    } catch {
      result = {
        summary: `${policyName} policy — see your uploaded document for full details.`,
        benefits: ['Coverage as per your policy document'],
        exclusions: ['See policy document for exclusions'],
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error('Analyze policy error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
