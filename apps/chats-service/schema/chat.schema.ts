import * as mongoose from 'mongoose';

export const ChatSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  participants: { type: [String], required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
