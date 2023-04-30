import * as mongoose from 'mongoose';

export interface IToken extends mongoose.Document {
  refreshToken: string;
  ip: string;
  userAgent: string;
  isValid: boolean;
  user: {
    type: mongoose.Types.ObjectId;
    ref: string;
    required: boolean;
  };
}

const TokenSchema = new mongoose.Schema(
  {
    refreshToken: { type: String, required: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    isValid: { type: Boolean, default: true },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Token = mongoose.model<IToken>('Token', TokenSchema);
