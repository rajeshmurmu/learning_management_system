import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      required: true,
    },
    lectureDescription: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    isPreviewFree: {
      type: Boolean,
      default: false,
    },
    publicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Lecture = mongoose.model("Lecture", lectureSchema);
