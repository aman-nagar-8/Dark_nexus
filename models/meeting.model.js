import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  adminName: {
    type: String,
  },
});
export default mongoose.models.Meeting ||
  mongoose.model("Meeting", MeetingSchema);
