import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
  messageId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  chatId: { type: String, required: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed },
});
