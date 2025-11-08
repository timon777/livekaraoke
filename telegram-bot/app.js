import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";

const apiId = 26882803; // ← твой API_ID
const apiHash = "b6e69393927ddcbf142779c91d07ca38"; // ← твой API_HASH
const session = new StringSession(""); // пусто при первом запуске

const client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });

(async () => {
  try {
    console.log("📲 Авторизация...");
    await client.start({
      phoneNumber: async () => await input.text("Введите номер телефона: "),
      phoneCode: async () => await input.text("Введите код из Telegram: "),
      password: async () => await input.text("Введите 2FA пароль (если есть): "),
      onError: (err) => console.log(err),
    });

    console.log("✅ Успешный вход как:", (await client.getMe()).username);
    console.log("\n🔑 Скопируй эту строку и вставь в Plesk-код:");
    console.log(client.session.save());

    // Получение сообщений из канала
    console.log("\n📨 Получение сообщений из канала @charterticketsme...\n");

    const channelUsername = "charterticketsme";
    const limit = 10; // Количество последних сообщений

    try {
      const messages = await client.getMessages(channelUsername, { limit });

      if (messages.length === 0) {
        console.log("❌ Сообщений не найдено");
      } else {
        console.log(`📬 Найдено ${messages.length} последних сообщений:\n`);
        console.log("═".repeat(60));

        messages.reverse().forEach((msg, index) => {
          console.log(`\n📩 Сообщение #${index + 1}`);
          console.log(`📅 Дата: ${msg.date.toLocaleString('ru-RU')}`);
          console.log(`👤 От: ${msg.sender?.username || msg.sender?.firstName || 'Канал'}`);

          if (msg.message) {
            console.log(`💬 Текст:\n${msg.message}`);
          }

          if (msg.media) {
            console.log(`🖼️ Есть медиа: ${msg.media.className}`);
          }

          console.log("─".repeat(60));
        });
      }
    } catch (channelError) {
      console.error("\n❌ Ошибка при получении сообщений из канала:");
      console.error(channelError.message);

      if (channelError.message.includes("No user has")) {
        console.log("\n💡 Возможно, канал не найден или у вас нет доступа.");
        console.log("   Убедитесь, что вы подписаны на канал @charterticketsme");
      }
    }

  } catch (error) {
    console.error("\n❌ Ошибка:", error.message);
  } finally {
    console.log("\n👋 Завершение работы...");
    await client.disconnect();
  }
})();
