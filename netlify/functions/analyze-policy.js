exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const { base64, policyName } = JSON.parse(event.body);

    if (!base64) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: `${policyName} — uploaded policy document.`,
          benefits: ['See your uploaded policy document for full coverage details'],
          exclusions: ['See your uploaded policy document for exclusions'],
        }),
      };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `You are an insurance document analyzer. Read this insurance policy PDF and extract key information.

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "summary": "One clear sentence describing what this policy covers",
  "benefits": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"],
  "exclusions": ["exclusion 1", "exclusion 2", "exclusion 3"]
}

Rules:
- Each benefit/exclusion must be under 7 words
- Extract REAL information from the document
- Policy name hint: "${policyName}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64,
            }
          },
          { text: prompt }
        ]
      }]
    });

    const rawText = response.text.replace(/```json|```/g, '').trim();
    console.log('Gemini response:', rawText.substring(0, 300));

    let result;
    try {
      result = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }

    if (!result) {
      result = {
        summary: `${policyName} — see your uploaded document for full details.`,
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
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summary: 'Policy uploaded successfully.',
        benefits: ['See your uploaded policy document'],
        exclusions: ['See your uploaded policy document'],
      }),
    };
  }
};
