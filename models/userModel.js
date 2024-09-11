const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      required: [true, "name required"],
      type: String,
      maxLength: 50,
    },

    slug: {
      type: String,
      lowercase: true,
    },

    email: {
      required: [true, "email required"],
      type: String,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Invalid email address"],
    },

    phone: {
      type: String,
    },

    profileImage: {
      type: String,
    },
    password: {
      required: [true, "password required"],
      type: String,
      minlength: [6, "to short password"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },

  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
