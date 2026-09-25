export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  const { name, phone, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Имя и телефон обязательны' });
  }

 
  const BOT_TOKEN = 8618340424:AAFfnYAPRNuOEIby4kpSYxLkoH4ZfpvpxwI;
  const CHAT_ID = 8618340424;

  const text =
    `🛠 Новая заявка с сайта\n\n` +
    `👤 Имя: ${name}\n` +
    `📞 Телефон: ${phone}\n` +
    `💬 Сообщение: ${message || '—'}`;

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
        }),
      }
    );

    if (!tgRes.ok) throw new Error('Telegram API error');

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Ошибка отправки' });
  }
}
