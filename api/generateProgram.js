const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  try {
    const body = await getBody(req);
    const { profile, language } = body;
    if (!profile) {
      return sendError(res, 400, 'Profile is required');
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      if (process.env.USE_MOCK_GEMINI === 'true') {
        const mock = buildMockProgram(profile, language);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(mock));
        return;
      }
      return sendError(res, 500, 'Missing GEMINI_API_KEY', 'Set GEMINI_API_KEY in the serverless environment');
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
      if (process.env.USE_MOCK_GEMINI === 'true') {
        const mock = buildMockProgram(profile, language);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(mock));
        return;
      }
      return sendError(
        res,
        response.status >= 500 ? 502 : response.status,
        'Gemini responded with an error',
        text
      );
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      if (process.env.USE_MOCK_GEMINI === 'true') {
        const mock = buildMockProgram(profile, language);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(mock));
        return;
      }
      return sendError(res, 502, 'No content returned from Gemini');
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseError) {
      console.error('Gemini JSON parse error', parseError, rawText);
      if (process.env.USE_MOCK_GEMINI === 'true') {
        const mock = buildMockProgram(profile, language);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(mock));
        return;
      }
      return sendError(res, 502, 'Gemini returned invalid JSON');
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(parsed));
  } catch (error) {
    console.error('Unhandled error in generateProgram', error);
    sendError(res, 500, 'Failed to generate program');
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

function buildMockProgram(profile, language = 'English') {
  const today = new Date().toISOString().split('T')[0];
  const preferredName = profile?.name || 'Mot3a friend';
  const mood = profile?.mood || 'calm';
  const energy = profile?.energy || 'steady';
  const thinkingStyle = profile?.thinkingStyle || 'balanced';
  const financialStress = profile?.financialStress || 'moderate';
  const priority = profile?.priority || 'wellbeing';
  const ageGroup = profile?.ageGroup || 'adult';

  return {
    userProfile: {
      name: preferredName,
      ageGroup,
      mood,
      energy,
      thinkingStyle,
      financialStress,
      priority,
    },
    date: today,
    language,
    sections: {
      timeAndFocus: {
        timeline: [
          {
            start: '07:30',
            end: '09:00',
            focus: energy === 'low' ? 'Gentle planning' : 'Deep focus',
            goal:
              thinkingStyle === 'intuitive'
                ? 'Free-write priorities with soft music'
                : 'Outline top tasks in small steps',
          },
          {
            start: '12:30',
            end: '13:00',
            focus: 'Light admin',
            goal: 'Review messages and one small financial action',
          },
        ],
      },
      nutritionAndEnergy: {
        tips: [
          {
            title: 'Hydrate early',
            description: 'Water with lemon within 30 minutes of waking for gentle energy.',
          },
          {
            title: 'Balanced lunch',
            description: 'Lean protein + grains + colorful veggies to support steady mood.',
          },
        ],
      },
      learningAndSelfDevelopment: {
        activities: [
          {
            topic: priority === 'learning' ? 'Targeted skill practice' : 'Calming reading',
            difficulty: energy === 'low' ? 'gentle' : 'medium',
            duration: '20m',
            resourceType: thinkingStyle === 'logical' ? 'article' : 'audio',
          },
        ],
      },
      financeAndWisdom: {
        steps: [
          {
            title: 'Tiny budget check',
            description:
              financialStress === 'high'
                ? 'Look at one expense and note a safe reduction idea.'
                : 'Confirm today’s spending limit and a small saving move.',
          },
          {
            title: 'Calm breathing before money tasks',
            description: 'Two minutes of slow breathing to lower tension before decisions.',
          },
        ],
      },
      entertainmentAndRecharge: {
        options: [
          {
            title: mood === 'tense' ? 'Soft walk' : 'Outdoor stroll',
            description: '10–15 minutes with light music or a mindful pace.',
          },
          {
            title: 'Warm connection',
            description: 'Send one kind voice note or message to someone supportive.',
          },
        ],
      },
      spiritualContent: {
        duas: [
          {
            arabic: 'اللهم إني أسألك السكينة والرزق الحلال الطيب',
            translation:
              language === 'Arabic'
                ? 'أسألك يا رب راحة القلب ورزقًا طيبًا'
                : language === 'French'
                  ? 'Je Te demande la sérénité et une subsistance licite et douce.'
                  : 'I ask You for calmness and wholesome, gentle provision.',
            theme: financialStress === 'high' ? 'sustenance' : 'focus',
          },
        ],
      },
      kidsContent: {
        cards: [
          {
            title: ageGroup === 'child' ? 'قصة قصيرة دافئة' : 'Gentle story time',
            idea: 'Share a 5-minute story about kindness and helping a friend.',
            tone: 'Warm',
          },
        ],
      },
    },
  };
}
