// api/send.js
export default async function handler(req, res) {
  // Разрешаем только POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { name, phone, message } = req.body || {};

    // Простая валидация
    if (!name || !phone) {
      return res.status(400).json({ ok: false, error: 'Имя и телефон обязательны' });
    }

    const text =
      `🔔 Новая заявка с сайта!\n\n` +
      `👤 Имя: ${name}\n` +
      `📞 Телефон: ${phone}\n` +
      `💬 Сообщение: ${message || '—'}`;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error('Не заданы TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
      return res.status(500).json({ ok: false, error: 'Ошибка конфигурации сервера' });
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const tgRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML'
      })
    });

    const data = await tgRes.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
      return res.status(500).json({ ok: false, error: data.description });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Ошибка:', err);
    return res.status(500).json({ ok: false, error: 'Внутренняя ошибка' });
  }
}