import { useState, useRef, useEffect } from "react";
import {
  WALLPAPERS,
  BLUR_OPTIONS,
  BRIGHTNESS_OPTIONS,
  IMAGE_COMPRESSION_SETTINGS,
} from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { useWallpaperStore } from "../store/useWallpaperStore";
import { compressImage } from "../lib/imageCompressor";
import {
  Send,
  Palette,
  MessageSquare,
  Image as ImageIcon,
  UploadCloud,
  Settings2,
  Check,
  Trash2,
} from "lucide-react";
import { THEMES } from "../constants/index.js";
import { useAuthStore } from "../store/useAuthStore";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
  { id: 3, content: "Check out these new theme options!", isSent: true },
  { id: 4, content: "Wow, they look amazing! 😍", isSent: false },
];

const SettingsPage = () => {
  const { authUser } = useAuthStore(); // Get authentication status
  const { theme, setTheme } = useThemeStore();
  const {
    selectedWallpaper,
    setWallpaper,
    blurIntensity,
    setBlurIntensity,
    brightness,
    setBrightness,
    customWallpapers,
    addCustomWallpaper,
    removeCustomWallpaper,
    initializeFromAuthUser,
    isUpdating,
    error
  } = useWallpaperStore();

  const [activeTab, setActiveTab] = useState("appearance");
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    initializeFromAuthUser();
  }, [initializeFromAuthUser]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const compressedFile = await compressImage(file, IMAGE_COMPRESSION_SETTINGS);
      const reader = new FileReader();

      reader.onload = (event) => {
        const newWallpaper = {
          id: `custom-${Date.now()}`,
          name: file.name.split(".")[0] || "Custom Wallpaper",
          thumbnail: event.target.result,
          url: event.target.result,
          blur: "4px",
          brightness: "0.85",
          isCustom: true,
        };
        addCustomWallpaper(newWallpaper);
        setUploading(false);
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Image compression error:", error);
      alert("Failed to process image. Please try another image.");
      setUploading(false);
    }
  };

  const handleRemoveCustomWallpaper = (id, e) => {
    e.stopPropagation();
    removeCustomWallpaper(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 pt-20 pb-10">
      {/* Loading overlay */}
      {isUpdating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Settings Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 p-4 sticky top-28">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                Settings
              </h2>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("appearance")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                    activeTab === "appearance"
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-base-200"
                  }`}
                >
                  <Palette className="w-5 h-5" />
                  Appearance
                </button>

                {/* Show Chat Wallpapers only if user is logged in */}
                {authUser && (
                  <button
                    onClick={() => setActiveTab("wallpapers")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                      activeTab === "wallpapers"
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-base-200"
                    }`}
                  >
                    <ImageIcon className="w-5 h-5" />
                    Chat Wallpapers
                  </button>
                )}

                {/* Show Notifications only if user is logged in */}
                {authUser && (
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                      activeTab === "notifications"
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-base-200"
                    }`}
                  >
                    <MessageSquare className="w-5 h-5" />
                    Notifications
                  </button>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "appearance" && (
              <div className="space-y-8">
                <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 p-6">
                  <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Palette className="w-5 h-5 text-primary" />
                      Theme Preferences
                    </h2>
                    <p className="text-base-content/70">
                      Customize FLARY's look and feel to match your style
                    </p>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {THEMES.map((t) => (
                      <button
                        key={t}
                        className={`
                          group flex flex-col items-center gap-2 p-3 rounded-xl transition-all
                          ${theme === t ? "ring-2 ring-primary ring-offset-2" : "hover:bg-base-200"}
                          relative overflow-hidden
                        `}
                        onClick={() => setTheme(t)}
                      >
                        <div
                          className="relative h-10 w-full rounded-lg overflow-hidden"
                          data-theme={t}
                        >
                          <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                            <div className="rounded bg-primary"></div>
                            <div className="rounded bg-secondary"></div>
                            <div className="rounded bg-accent"></div>
                            <div className="rounded bg-neutral"></div>
                          </div>
                        </div>
                        <span className="text-xs font-medium truncate w-full text-center">
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </span>
                        {theme === t && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden">
                  <div className="p-5 border-b border-base-300">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Live Preview
                    </h3>
                    <p className="text-sm text-base-content/70 mt-1">
                      See how your theme looks in action
                    </p>
                  </div>
                  <div className="p-4 bg-base-200">
                    <div className="max-w-lg mx-auto">
                      <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                        {/* Chat header */}
                        <div className="px-4 py-3 border-b border-base-300 bg-base-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                              L
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">Louay Chamri</h3>
                              <p className="text-xs text-base-content/70">Online</p>
                            </div>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        </div>

                        {/* Messages */}
                        <div className="p-4 space-y-4 min-h-[250px] max-h-[250px] overflow-y-auto bg-base-100 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5OTkiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzAgMTVjOC4yODQgMCAxNSA2LjcxNiAxNSAxNXMtNi43MTYgMTUtMTUgMTUtMTUtNi43MTYtMTUtMTUgNi43MTYtMTUgMTUtMTVtMC0xNUMxNi40MzEgMCA1IDExLjQzMSA1IDI1czExLjQzMSAyNSAyNSAyNSAyNS0xMS40MzEgMjUtMjUtMTEuNDMxLTI1LTI1LTI1eiIvPjwvZz48L2c+PC9zdmc+')]">
                          {PREVIEW_MESSAGES.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.isSent ? "justify-end" : "justify-start"
                              } group`}
                            >
                              <div
                                className={`
                                  max-w-[80%] rounded-2xl p-3 shadow-sm relative
                                  ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                                  ${message.isSent ? "rounded-br-none" : "rounded-bl-none"}
                                  transition-all duration-200 group-hover:shadow-md
                                `}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p
                                  className={`
                                    text-[10px] mt-1.5 flex items-center justify-end gap-1
                                    ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                                  `}
                                >
                                  <span>12:00 PM</span>
                                  {message.isSent && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-primary-content/70"
                                    >
                                      <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Message input */}
                        <div className="p-4 border-t border-base-300 bg-base-100">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              className="input input-bordered flex-1 text-sm h-10 focus:ring-2 focus:ring-primary/50"
                              placeholder="Type a message..."
                              value="This is a preview"
                              readOnly
                            />
                            <button className="btn btn-primary h-10 min-h-0 shadow-lg hover:shadow-primary/30">
                              <Send size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "wallpapers" && authUser && (
              <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 p-6">
                <div className="flex flex-col gap-1 mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Chat Wallpaper
                  </h2>
                  <p className="text-base-content/70">Choose a background for your conversations</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[...WALLPAPERS, ...customWallpapers].map((wallpaper) => (
                    <button
                      key={wallpaper.id}
                      className={`
                        group relative aspect-square rounded-xl overflow-hidden shadow-md
                        ${selectedWallpaper.id === wallpaper.id ? "ring-2 ring-primary ring-offset-2" : ""}
                        transition-all duration-200
                      `}
                      onClick={() => setWallpaper(wallpaper)}
                    >
                      {wallpaper.isCustom && (
                        <div 
                          className="absolute top-2 right-2 z-10 p-1.5 bg-error/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={(e) => handleRemoveCustomWallpaper(wallpaper.id, e)}
                          role="button"
                          tabIndex={0}
                          aria-label="Remove wallpaper"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-base-100/30 to-base-300/30"></div>
                      {wallpaper.thumbnail.startsWith("http") ||
                      wallpaper.thumbnail.startsWith("data:image") ? (
                        <img
                          src={wallpaper.thumbnail}
                          alt={wallpaper.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{ background: wallpaper.thumbnail }}
                        ></div>
                      )}
                      <div
                        className={`
                          absolute inset-0 flex items-center justify-center bg-black/30 opacity-0
                          group-hover:opacity-100 transition-opacity
                          ${selectedWallpaper.id === wallpaper.id ? "opacity-100" : ""}
                        `}
                      >
                        <div className="bg-primary text-primary-content px-3 py-1 rounded-full text-sm font-medium">
                          {selectedWallpaper.id === wallpaper.id ? "Selected" : "Select"}
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-medium truncate">
                        {wallpaper.name}
                      </div>
                    </button>
                  ))}

                  {/* Custom wallpaper upload */}
                  <div
                    className="aspect-square rounded-xl border-2 border-dashed border-base-300 flex flex-col items-center justify-center gap-2 p-4 hover:border-primary transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    {uploading ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-base-content/50" />
                        <p className="text-sm font-medium text-center">
                          Upload Custom Wallpaper
                        </p>
                        <p className="text-xs text-base-content/50 text-center">
                          JPG, PNG (auto-compressed)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-base-300">
                  <h3 className="font-medium mb-3">Wallpaper Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">Blur Intensity</h4>
                        <p className="text-xs text-base-content/70">
                          Adjust background blur effect
                        </p>
                      </div>
                      <select
                        className="select select-bordered select-sm w-24"
                        value={blurIntensity}
                        onChange={(e) => setBlurIntensity(e.target.value)}
                      >
                        {BLUR_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">Darken Effect</h4>
                        <p className="text-xs text-base-content/70">
                          Make background darker for readability
                        </p>
                      </div>
                      <select
                        className="select select-bordered select-sm w-24"
                        value={brightness}
                        onChange={(e) => setBrightness(e.target.value)}
                      >
                        {BRIGHTNESS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && authUser && (
              <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Notification Settings
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">New Message Alerts</h3>
                      <p className="text-sm text-base-content/70">
                        Play sound for incoming messages
                      </p>
                    </div>
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Message Previews</h3>
                      <p className="text-sm text-base-content/70">
                        Show message content in notifications
                      </p>
                    </div>
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Vibration</h3>
                      <p className="text-sm text-base-content/70">
                        Vibrate for new messages
                      </p>
                    </div>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;