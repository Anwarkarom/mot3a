import { API_BASE } from '../utils/constants';

export async function generateProgram(payload) {
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
