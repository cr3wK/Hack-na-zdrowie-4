// import Message from '../../models/message.model.js'
// import { removeFile } from '../../utils/file.js'
// import onError from '../../utils/onError.js'
//
// const messages = {}
//
// export default function messageHandlers(io, socket) {
//   const { roomId } = socket
//
//   const updateMessageList = () => {
//     io.to(roomId).emit('message_list:update', messages[roomId])
//   }
//
//   socket.on('message:get', async () => {
//     try {
//       const _messages = await Message.find({ roomId })
//
//       messages[roomId] = _messages
//
//       updateMessageList()
//     } catch (e) {
//       onError(e)
//     }
//   })
//
//   socket.on('message:add', (message) => {
//     Message.create(message).catch(onError)
//     message.createdAt = Date.now()
//
//     messages[roomId].push(message)
//
//     updateMessageList()
//   })
//
//   socket.on('message:remove', (message) => {
//     const { messageId, messageType, textOrPathToFile } = message
//
//     Message.deleteOne({ messageId })
//       .then(() => {
//         if (messageType !== 'text') {
//           removeFile(textOrPathToFile)
//         }
//       })
//       .catch(onError)
//
//     messages[roomId] = messages[roomId].filter((m) => m.messageId !== messageId)
//
//     updateMessageList()
//   })
// }
import Message from '../../models/message.model.js'
import { removeFile } from '../../utils/file.js'
import onError from '../../utils/onError.js'

const messages = {}

export default function messageHandlers(io, socket) {
  const { roomId } = socket

  // Обновление списка сообщений
  const updateMessageList = () => {
    io.to(roomId).emit('message_list:update', messages[roomId])
  }

  // Получение всех сообщений из базы данных
  socket.on('message:get', async () => {
    try {
      const _messages = await Message.find({}) // Получаем все сообщения

      // Сохраняем все сообщения в глобальный объект, по ключу комнаты
      messages[roomId] = _messages

      // Отправляем все сообщения на клиент
      updateMessageList()
    } catch (e) {
      onError(e)
    }
  })

  // Добавление нового сообщения
  socket.on('message:add', async (message) => {
    try {
      // Сохраняем новое сообщение в базе данных
      const createdMessage = await Message.create(message)
      messages[roomId].push({ ...createdMessage, createdAt: Date.now() })

      // Отправляем обновленный список сообщений
      updateMessageList()
    } catch (e) {
      onError(e)
    }
  })

  // Удаление сообщения
  socket.on('message:remove', async (message) => {
    const { messageId, messageType, textOrPathToFile } = message

    try {
      // Удаляем сообщение из базы данных
      await Message.deleteOne({ messageId })

      // Если это не текстовое сообщение, удаляем файл
      if (messageType !== 'text') {
        removeFile(textOrPathToFile)
      }

      // Удаляем сообщение из массива
      messages[roomId] = messages[roomId].filter((m) => m.messageId !== messageId)

      // Отправляем обновленный список сообщений
      updateMessageList()
    } catch (e) {
      onError(e)
    }
  })
}
