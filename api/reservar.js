// api/reservar.js
import fetch from 'node-fetch';

export default async function handler(request, response) {
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

  if (!GOOGLE_SCRIPT_URL) {
    return response.status(500).json({ success: false, message: 'URL de API no configurada en el servidor.' });
  }

  try {
    const fetchResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body),
    });

    const result = await fetchResponse.json();
    return response.status(200).json(result);
  } catch (error) {
    return response.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
}
