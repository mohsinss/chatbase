import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  provider: String,
  providerAccountId: String,
  type: String,
  token_type: String,
  scope: String,
  access_token: String,
  expires_at: Date,
});

export default mongoose.models.Account || mongoose.model("Account", accountSchema);