
import User from "../models/usermodel.js";

export const updateUserWallpaper = async (req, res) => {
  try {
    const { selectedWallpaperId, blurIntensity, brightness, customWallpapers } = req.body;
    const user = req.user;

    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate customWallpapers array
    const validatedCustomWallpapers = Array.isArray(customWallpapers) 
      ? customWallpapers.filter(wp => 
          wp.id && wp.name && (wp.thumbnail || wp.url)
        ).map(wp => ({
          id: wp.id,
          name: wp.name,
          thumbnail: wp.thumbnail || null,
          url: wp.url || null,
          blur: wp.blur || "4px",
          brightness: wp.brightness || "0.85"
        }))
      : [];

    const updateData = {
      wallpaperSettings: {
        selectedWallpaperId: selectedWallpaperId || user.wallpaperSettings?.selectedWallpaperId || "default-1",
        blurIntensity: blurIntensity || user.wallpaperSettings?.blurIntensity || "4px",
        brightness: brightness || user.wallpaperSettings?.brightness || "0.9",
        customWallpapers: validatedCustomWallpapers
      }
    };

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('wallpaperSettings');

    res.status(200).json({ 
      wallpaperSettings: updatedUser.wallpaperSettings 
    });

  } catch (error) {
    console.error("Error updating wallpaper:", error);
    res.status(500).json({ 
      message: "Failed to update wallpaper settings",
      error: error.message 
    });
  }
};