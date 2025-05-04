import Message from '../../models/message.model.js';
import { removeFile } from '../../utils/file.js';
import onError from '../../utils/onError.js';

// Глобальный объект для хранения сообщений в памяти: ключ - roomId
const messages = {};

export default function messageHandlers(io, socket) {
  const { roomId } = socket;

  // Функция для обновления списка сообщений и отправки их клиентам
  const updateMessageList = () => {
    if (!messages[roomId]) {
      messages[roomId] = []; // Инициализируем пустой массив, если сообщений еще нет
    }
    console.log(`Updating messages for room: ${roomId}`, messages[roomId]); // Лог для отладки
    io.to(roomId).emit('message_list:update', messages[roomId]);
  };

  // Обработчик события получения всех сообщений
  socket.on('message:get', async () => {
    try {
      console.log(`[message:get] Fetching messages for room: ${roomId}`);
      const _messages = await Message.find({ roomId }); // Загружаем из базы сообщения для этой комнаты
      messages[roomId] = _messages || []; // Сохраняем в глобальный объект
      updateMessageList(); // Отправляем сообщения на клиента
    } catch (e) {
      console.error('[message:get] Error:', e);
      onError(e);
    }
  });

  // Обработчик события добавления нового сообщения
  socket.on('message:add', async (message) => {
    try {
      console.log(`[message:add] Adding a message in room: ${roomId}`, message);

      // Инициализация массива сообщений для комнаты, если массив отсутствует
      if (!messages[roomId]) {
        messages[roomId] = [];
      }

      // Сохраняем сообщение в базе данных
      const createdMessage = await Message.create({ ...message, roomId }); // Добавляем roomId к сообщению

      // Добавляем сообщение в память и отправляем обновление клиентам
      messages[roomId].push(createdMessage.toObject()); // Преобразуем из Mongoose-документа в обычный объект
      updateMessageList(); // Обновляем список на клиенте
    } catch (e) {
      console.error('[message:add] Error:', e);
      onError(e);
    }
  });

  // Обработчик события удаления сообщения
  socket.on('message:remove', async (message) => {
    const { messageId, messageType, textOrPathToFile } = message;

    try {
      console.log(`[message:remove] Removing message ${messageId} from room: ${roomId}`);

      // Проверяем, есть ли сообщения для текущей комнаты
      const messageIndex = messages[roomId]?.findIndex((m) => m.messageId === messageId);

      if (messageIndex !== -1) {
        // Удаляем сообщение из массива
        messages[roomId].splice(messageIndex, 1);

        // Удаляем сообщение из базы данных
        await Message.deleteOne({ messageId });

        // Удаляем файл, если это не текстовое сообщение
        if (messageType !== 'text') {
          removeFile(textOrPathToFile);
        }

        updateMessageList(); // Отправляем обновленный список сообщений
      } else {
        console.warn(`[message:remove] Message with ID ${messageId} not found in room ${roomId}`);
      }
    } catch (e) {
      console.error('[message:remove] Error:', e);
      onError(e);
    }
  });
}