const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end('Method not allowed');
    return;
  }

  try {
    const body = await getBody(req);
    const { profile, language } = body;
    if (!profile) {
      res.statusCode = 400;
      res.end('Profile is required');
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.statusCode = 500;
      res.end('Missing GEMINI_API_KEY');
      return;
    }

    const prompt = buildPrompt(profile, language);

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
      res.statusCode = 502;
      res.end('No content returned from Gemini');
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseError) {
      console.error('Gemini JSON parse error', parseError, rawText);
      res.statusCode = 502;
      res.end('Gemini returned invalid JSON');
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(parsed));
  } catch (error) {
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
