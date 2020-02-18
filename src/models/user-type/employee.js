import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const employeeSchema = new Schema(
  {
    full_name: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    employee_id: {
      type: String,
      unique: true,
      required: true
    },
    is_employee: {
      type: Boolean,
      default: true
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post"
      }
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  { timestamps: true }
);

employeeSchema.methods = {
  jwtToken: function() {
    return jwt.sign(
      { userId: this._id, isEmployee: this.is_employee },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d"
      }
    );
  }
};

export default mongoose.model("Employee", employeeSchema);
