import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  chatbotId: string;
  platform: string;
  platformId: string;
  title: string;
  content: string;
  status: "scheduled" | "draft" | "published";
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema<IPost> = new Schema(
  {
    chatbotId: { type: String, required: true, index: true },
    platform: { type: String, required: true, index: true },
    platformId: { type: String, required: true, index: true },
    title: { type: String, required: false },
    content: { type: String, required: true },
    status: { type: String, enum: ["scheduled", "draft", "published"], required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
