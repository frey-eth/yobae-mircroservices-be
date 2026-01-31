import * as mongoose from 'mongoose';

export const ChatSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  name: { type: String, required: false },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
