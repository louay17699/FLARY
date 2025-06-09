import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePic: {
      type: String,
      default: "",
    },
        bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    lastOnline: {
  type: Date,
  default: null
  },
    wallpaperSettings: {
      selectedWallpaperId: { type: String, default: "default-1" },
      blurIntensity: { type: String, default: "4px" },
      brightness: { type: String, default: "0.9" },
      customWallpapers: {
        type: [
          {
            id: { type: String, required: true },
            name: { type: String, required: true },
            thumbnail: { type: String },
            url: { type: String },
            blur: { type: String, default: "4px" },
            brightness: { type: String, default: "0.85" },
          },
        ],
        default: [],
        validate: {
          validator: function (wallpapers) {
            return wallpapers.every((wp) => wp.thumbnail || wp.url);
          },
          message: "Each custom wallpaper must have either thumbnail or url",
        },
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;