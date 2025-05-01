import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { ALLOWED_ORIGIN, MONGODB_URI } from './config.js';
import onConnection from './socket_io/onConnection.js';
import { getFilePath } from './utils/file.js';
import onError from './utils/onError.js';
import upload from './utils/upload.js';
import cookieParser from 'cookie-parser';
import doctorRoutes from './routes/doctor.route.js';
import patientRoutes from './routes/patient.route.js';
import roomRoutes from './routes/room.route.js';

const app = express();

// CORS с передачей cookies
app.use(
    cors({
      origin: ALLOWED_ORIGIN,
      credentials: true // Разрешаем передачу cookies
    })
);

app.use(express.json());
app.use(cookieParser());

// Ваши маршруты
app.use('/doctor', doctorRoutes);
app.use('/patient', patientRoutes);
app.use('/room', roomRoutes);

app.use('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.sendStatus(400);

  const relativeFilePath = req.file.path
      .replace(/\\/g, '/')
      .split('server/files')[1];

  res.status(201).json(relativeFilePath);
});

app.use('/files', (req, res) => {
  const filePath = getFilePath(req.url);
  res.status(200).sendFile(filePath);
});

app.use(onError);

try {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('🚀 Connected');
} catch (e) {
  onError(e);
}

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGIN,
    credentials: true // Разрешаем cookies для socket.io
  },
  serveClient: false
});

io.on('connection', (socket) => {
  onConnection(io, socket);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

export default app;