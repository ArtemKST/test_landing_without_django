// netlify/functions/sendTelegram.js

const fetch = require('node-fetch');  // убедитесь, что эта зависимость доступна

// Ваши Telegram‑данные
const TOKEN   = "8042136856:AAHqDwd0EisU8L8BTQA7ZF06ZOZl_j0K4eU";
const CHAT_ID = "951313286";

exports.handler = async function(event, context) {
  // Только POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: 'Method Not Allowed'
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: 'Invalid JSON'
    };
  }

  const { name, phone, email, message } = payload;

  // Формируем текст для Telegram
  const text = `
🔔 Новая заявка с сайта!
👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email}
💬 Комментарий: ${message}
  `;

  // Отправляем в Telegram
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text })
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return {
        statusCode: res.status,
        body: `Telegram API error: ${errorText}`
      };
    }

    return {
      statusCode: 200,
      body: 'OK'
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: `Fetch error: ${err.message}`
    };
  }
};