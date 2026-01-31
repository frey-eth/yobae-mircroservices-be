import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true },
  chatId: { type: String, required: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  attached_files: { type: [String], default: [] },
});
