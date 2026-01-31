import mongoose from 'mongoose';

export const ChatParticipantSchema = new mongoose.Schema({
  chatId: { type: String, required: true, index: true },
  participantId: { type: String, required: true, index: true },
  joinedAt: { type: Date, default: Date.now },
});
