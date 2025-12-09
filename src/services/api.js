import { API_BASE } from '../utils/constants';

export async function generateProgram(payload) {
  let response;
  try {
    response = await fetch(`${API_BASE}/api/generateProgram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (networkError) {
    throw new Error('Network error while contacting the AI service');
  }

  const text = await response.text();

  if (!response.ok) {
    try {
      const parsed = JSON.parse(text || '{}');
      const detail = parsed.detail ? `: ${parsed.detail}` : '';
      throw new Error(parsed.error ? `${parsed.error}${detail}` : 'Failed to reach AI service');
    } catch {
      throw new Error(text || 'Failed to reach AI service');
    }
  }

  try {
    return JSON.parse(text);
  } catch (parseError) {
    throw new Error('Received invalid data from AI service');
  }
  const response = await fetch(`${API_BASE}/api/generateProgram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || 'Failed to reach AI service');
  }

  const data = await response.json();
  return data;
}
