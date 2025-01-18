import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const teamSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

teamSchema.plugin(toJSON);

export default mongoose.models.Team || mongoose.model("Team", teamSchema); 