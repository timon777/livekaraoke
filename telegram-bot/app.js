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

    // Показать список всех диалогов (групп, каналов, чатов)
    console.log("\n📋 Получение списка ваших диалогов...\n");

    try {
      const dialogs = await client.getDialogs({ limit: 100 });

      console.log("═".repeat(60));
      console.log("ВАШИ ГРУППЫ И КАНАЛЫ:");
      console.log("═".repeat(60));

      dialogs.forEach((dialog, index) => {
        const entity = dialog.entity;
        const type = entity.className;
        let name = entity.title || entity.firstName || "Без названия";
        let username = entity.username ? `@${entity.username}` : "";
        let id = entity.id;

        // Определяем тип
        let typeIcon = "💬";
        let typeText = "Чат";

        if (type === "Channel") {
          typeIcon = entity.broadcast ? "📢" : "👥";
          typeText = entity.broadcast ? "Канал" : "Группа";
        }

        console.log(`\n${index + 1}. ${typeIcon} ${name}`);
        if (username) console.log(`   Username: ${username}`);
        console.log(`   ID: ${id}`);
        console.log(`   Тип: ${typeText}`);
        console.log("─".repeat(60));
      });

    } catch (dialogsError) {
      console.error("❌ Ошибка при получении списка диалогов:", dialogsError.message);
    }

    // Получение сообщений из канала/группы
    console.log("\n📨 Получение сообщений...\n");

    // Можно указать username (для публичных) или ID (для приватных групп)
    const chatSource = "charterticketsme"; // или ID группы, например: -1001234567890
    const limit = 10; // Количество последних сообщений

    try {
      const messages = await client.getMessages(chatSource, { limit });

      if (messages.length === 0) {
        console.log("❌ Сообщений не найдено");
      } else {
        console.log(`📬 Найдено ${messages.length} последних сообщений:\n`);
        console.log("═".repeat(60));

        messages.reverse().forEach((msg, index) => {
          console.log(`\n📩 Сообщение #${index + 1}`);
          console.log(`📅 Дата: ${msg.date.toLocaleString('ru-RU')}`);

          // Получаем информацию об отправителе
          let senderInfo = 'Неизвестно';
          if (msg.sender) {
            senderInfo = msg.sender.username
              ? `@${msg.sender.username}`
              : (msg.sender.firstName || '') + (msg.sender.lastName ? ' ' + msg.sender.lastName : '');
          }
          console.log(`👤 От: ${senderInfo}`);

          if (msg.message) {
            console.log(`💬 Текст:\n${msg.message}`);
          }

          if (msg.media) {
            console.log(`🖼️ Есть медиа: ${msg.media.className}`);
          }

          console.log("─".repeat(60));
        });
      }
    } catch (chatError) {
      console.error("\n❌ Ошибка при получении сообщений:");
      console.error(chatError.message);

      if (chatError.message.includes("No user has") || chatError.message.includes("USERNAME_INVALID")) {
        console.log("\n💡 Возможно, канал/группа не найдены или у вас нет доступа.");
        console.log("   Для приватных групп используйте ID вместо username.");
        console.log("   ID можно найти в списке диалогов выше.");
      }
    }

  } catch (error) {
    console.error("\n❌ Ошибка:", error.message);
  } finally {
    console.log("\n👋 Завершение работы...");
    await client.disconnect();
  }
})();
