const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
    res.statusCode = 405;
    res.end('Method not allowed');
    return;
  }

  try {
    const body = await getBody(req);
    const { profile, language } = body;
    if (!profile) {
      return sendError(res, 400, 'Profile is required');
      res.statusCode = 400;
      res.end('Profile is required');
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return sendError(res, 500, 'Missing GEMINI_API_KEY', 'Set GEMINI_API_KEY in the serverless environment');
      res.statusCode = 500;
      res.end('Missing GEMINI_API_KEY');
      return;
    }

    const prompt = buildPrompt(profile, language);

    let response;
    try {
      response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        }),
      });
    } catch (fetchError) {
      console.error('Gemini fetch error', fetchError);
      return sendError(res, 502, 'Failed to contact Gemini', fetchError.message);
    }

    if (!response.ok) {
      const text = await response.text();
      console.error('Gemini responded with error', response.status, text);
      return sendError(
        res,
        response.status >= 500 ? 502 : response.status,
        'Gemini responded with an error',
        text
      );
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      res.statusCode = 500;
      res.end(text);
      return;
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return sendError(res, 502, 'No content returned from Gemini');
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseError) {
      console.error('Gemini JSON parse error', parseError, rawText);
      return sendError(res, 502, 'Gemini returned invalid JSON');
    }

    const parsed = JSON.parse(rawText);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(parsed));
  } catch (error) {
    console.error('Unhandled error in generateProgram', error);
    sendError(res, 500, 'Failed to generate program');
    console.error(error);
    res.statusCode = 500;
    res.end('Failed to generate program');
  }
}

function buildPrompt(profile, language) {
  return `You are Mot3a (متعة), a gentle personal assistant. Return ONLY valid JSON following this schema:
{
  "userProfile": {"name": string, "ageGroup": string, "mood": string, "energy": string, "thinkingStyle": string, "financialStress": string, "priority": string},
  "date": string,
  "language": "${language}",
  "sections": {
    "timeAndFocus": {"timeline": [{"start": "07:30", "end": "09:00", "focus": "Deep focus", "goal": "Write or build"}]},
    "nutritionAndEnergy": {"tips": [{"title": "Hydrate", "description": "Water with lemon"}]},
    "learningAndSelfDevelopment": {"activities": [{"topic": "Skill", "difficulty": "gentle|medium|energized", "duration": "20m", "resourceType": "article|video|audio"}]},
    "financeAndWisdom": {"steps": [{"title": "Budget check", "description": "5-minute review"}]},
    "entertainmentAndRecharge": {"options": [{"title": "Quiet walk", "description": "10-minute outdoor walk"}]},
    "spiritualContent": {"duas": [{"arabic": "string", "translation": "string", "theme": "anxiety relief|focus|sustenance"}]},
    "kidsContent": {"cards": [{"title": "Mini story", "idea": "Short uplifting story", "tone": "Warm"}]}
  }
}
Constraints: keep tasks low-risk if financial stress is high. Tone must stay gentle and supportive. Adapt time blocks to the profile mood, energy, and thinking style. Provide Arabic dua text with translation in the selected language. Reply in language ${language}.`;
}

function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendError(res, statusCode, message, detail) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  const payload = detail ? { error: message, detail } : { error: message };
  res.end(JSON.stringify(payload));
}
