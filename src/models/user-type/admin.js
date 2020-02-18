import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const adminSchema = new Schema({
  full_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  employees: [
    {
      type: Schema.Types.ObjectId,
      ref: "Employee"
    }
  ],
  is_admin: {
    type: Boolean,
    default: true
  }
});

adminSchema.methods = {
  jwtToken: function() {
    return jwt.sign(
      { userId: this._id, isAdmin: this.is_admin },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d"
      }
    );
  }
};

export default mongoose.model("Admin", adminSchema);
