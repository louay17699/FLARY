import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Mic, SmilePlus } from "lucide-react";
import toast from "react-hot-toast";
import imageCompression from 'browser-image-compression';
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from 'emoji-picker-react';

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSendingImage, setIsSendingImage] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const { sendMessage } = useChatStore();

  // Handle click outside to close emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsSendingImage(true);
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsSendingImage(false);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Compression error:", error);
      toast.error("Failed to process image");
      setIsSendingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    const toastId = toast.loading("Sending message...");
    setIsSendingImage(true);

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      setShowEmojiPicker(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Message sent", { id: toastId });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(error.message || "Failed to send message", { id: toastId });
    } finally {
      setIsSendingImage(false);
    }
  };

  const onEmojiClick = (emojiData) => {
    setText(prevText => prevText + emojiData.emoji);
  };

  return (
    <div className="p-4 w-full bg-base-100/80 backdrop-blur-sm border-t border-base-300/50 relative">
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-3 flex items-center gap-2"
          >
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className={`w-24 h-24 object-cover rounded-xl border-2 border-base-300/30 shadow-sm ${
                  isSendingImage ? "opacity-70" : "group-hover:brightness-95 transition-all"
                }`}
              />
              {isSendingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                  <span className="loading loading-spinner loading-sm text-white"></span>
                </div>
              )}
              <motion.button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-error text-error-content shadow-sm
                flex items-center justify-center hover:scale-110 transition-transform"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                disabled={isSendingImage}
              >
                <X className="size-3" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
          disabled={isSendingImage}
        />
        
        {/* Left action buttons */}
        <div className="flex items-center gap-1">
          <motion.button
            type="button"
            className="btn btn-ghost btn-sm btn-circle text-base-content/70 hover:text-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSendingImage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image size={20} />
          </motion.button>
          
          <motion.button 
            type="button" 
            className="btn btn-ghost btn-sm btn-circle text-base-content/70 hover:text-secondary"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SmilePlus size={20} />
          </motion.button>
        </div>

        {/* Main input */}
        <div className="flex-1 relative">
          <motion.input
            type="text"
            className={`w-full input input-bordered rounded-full pl-4 pr-12 transition-all ${
              isFocused ? "input-primary border-2" : ""
            }`}
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSendingImage}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            animate={{
              paddingRight: isFocused || text ? '3.5rem' : '4.5rem'
            }}
          />
          
          {!text && !isFocused && (
            <motion.button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-base-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Mic size={20} />
            </motion.button>
          )}
        </div>

        {/* Send button */}
        <motion.button
          type="submit"
          className={`btn btn-circle ${
            (text.trim() || imagePreview) 
              ? "btn-primary text-primary-content" 
              : "btn-ghost text-base-content/30"
          }`}
          disabled={(!text.trim() && !imagePreview) || isSendingImage}
          whileHover={ (text.trim() || imagePreview) ? { scale: 1.05 } : {} }
          whileTap={ (text.trim() || imagePreview) ? { scale: 0.95 } : {} }
        >
          {isSendingImage ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <Send size={20} />
          )}
        </motion.button>
      </form>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute bottom-20 left-16 z-50 shadow-xl rounded-lg overflow-hidden"
            ref={emojiPickerRef}
          >
            <EmojiPicker 
              onEmojiClick={onEmojiClick}
              width={300}
              height={350}
              previewConfig={{ showPreview: false }}
              theme="dark"
              searchDisabled={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageInput;