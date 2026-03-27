exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const { message, policies } = JSON.parse(event.body);

    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing message' }) };
    }

    const policyContext = policies?.length
      ? policies.map(p => `
**${p.title}** (${p.type} insurance)
- Coverage: ${p.coverage}
- Key Benefits: ${Array.isArray(p.benefits) ? p.benefits.join(', ') : p.benefits || 'N/A'}
- Exclusions: ${Array.isArray(p.exclusions) ? p.exclusions.join(', ') : p.exclusions || 'N/A'}
- Status: ${p.status}
      `.trim()).join('\n\n')
      : 'No policies currently loaded.';

    const SYSTEM_INSTRUCTION = `You are a friendly, supportive insurance assistant for YuLife — a gamified insurance and wellbeing app.

## ABOUT YULIFE
YuLife is a UK-based insurance company that combines life insurance, health insurance, and wellbeing into one app.
- **YuCoin**: Virtual currency earned by doing healthy activities — walking (steps), meditation, cycling, running. Redeemed for real gift cards (Amazon, Netflix, etc.) and charity donations.
- **Quests**: Daily and weekly challenges to earn YuCoins (e.g. "Walk 8,000 steps today", "Meditate for 10 minutes").
- **Leaderboard**: Compete with colleagues/friends on wellness activities.
- **Streaks**: Consecutive days of completing activities — builds your wellness streak.
- **Rewards**: Gift cards, vouchers, and partner discounts earned with YuCoins.
- **Claims**: Submit claims directly in the app. Processed within 5–10 working days. You'll need: date of incident, description, and supporting evidence (photo/PDF).
- **Policies available**: Life Insurance, Health Insurance, Dental Care, Income Protection — plus users can add their own custom policies.
- **App access**: Available on iOS, Android, and web browser.
- **Support**: Users can contact YuLife support via the app or email hello@yulife.com.

## USER'S POLICIES
${policyContext}

## YOUR ROLE
- Answer questions about the user's specific policies using the data above
- Answer general YuLife questions using the knowledge above
- Help users understand what is and isn't covered
- Guide users through the claims process
- Keep responses concise, warm, and encouraging
- Use simple language — avoid jargon
- If asked about specific claim statuses or account details not shown above, direct them to YuLife support`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: response.text }),
    };
  } catch (err) {
    console.error('Gemini error:', err.message);
    return {
      statusCode: 200,
      body: JSON.stringify({ text: `Error: ${err.message}` }),
    };
  }
};
