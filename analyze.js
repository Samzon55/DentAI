// /api/analyze.js
// Vercel serverless function that calls Claude to analyze car damage
// Requires environment variable: ANTHROPIC_API_KEY

export default async function handler(req, res) {
  // CORS for safety
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured in Vercel' });
  }

  try {
    const { imageData, mimeType } = req.body;
    if (!imageData) return res.status(400).json({ error: 'No image data provided' });

    const prompt = `You are an expert automotive damage estimator with 20 years of body shop experience in the US market. Analyze this car damage photo carefully. Return ONLY a valid JSON object with no preamble, no markdown, no code fences. Use this exact structure:

{
  "damageType": "Short descriptive title, max 6 words. Example: Rear Bumper Collision Damage",
  "severity": "Low" | "Medium" | "High",
  "severityPercent": number between 10-95 reflecting damage severity,
  "costLow": realistic low-end repair cost in USD (integer),
  "costHigh": realistic high-end repair cost in USD (integer),
  "damageDetail": "2-3 sentences describing exactly what is visibly damaged and how severely",
  "recommendation": "1-2 sentences on whether to DIY, take to body shop, or file with insurance, and why",
  "shopScript": "One sentence the customer can say to a shop to sound informed and get a fair quote"
}

Be realistic with cost ranges. Use 2024 US labor rates (~$80-150/hr) and current parts pricing. Account for paint blending, prep work, and parts replacement vs repair.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mimeType || 'image/jpeg', data: imageData } },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: 'Claude API error: ' + errText });
    }

    const data = await response.json();
    const raw = data.content.map(c => c.text || '').join('').trim();
    const clean = raw.replace(/```json|```/g, '').trim();

    try {
      const parsed = JSON.parse(clean);
      return res.status(200).json(parsed);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Failed to parse Claude response', raw: clean });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
