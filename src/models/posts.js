import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: String
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "Employee"
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Employee"
      }
    ],
    dis_likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Employee"
      }
    ],
    like_state: {
      type: Boolean,
      default: false
    },
    likes_count: {
      type: Number,
      default: 0
    },
    dislikes_count: {
      type: Number,
      default: 0
    },
    dislike_state: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
