import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Mic, SmilePlus, StopCircle } from "lucide-react";
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
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const { sendMessage } = useChatStore();

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

  const removeAudio = () => {
    setAudioURL(null);
    audioChunksRef.current = [];
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    clearInterval(timerRef.current);
    setRecordingTime(0);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setIsRecording(false);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) { // Stop after 1 minute
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    clearInterval(timerRef.current);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !audioURL) return;

    const toastId = toast.loading("Sending message...");
    setIsSendingImage(true);

    try {
      let voiceBase64 = null;
      if (audioURL) {
        const audioBlob = await fetch(audioURL).then(r => r.blob());
        voiceBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.readAsDataURL(audioBlob);
        });
      }

      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        voice: voiceBase64 ? `data:audio/mp3;base64,${voiceBase64}` : null,
        duration: recordingTime,
      });

      setText("");
      setImagePreview(null);
      setAudioURL(null);
      setRecordingTime(0);
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

        {audioURL && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-3 flex items-center gap-2 bg-base-200/50 rounded-xl p-3"
          >
            <div className="relative flex-1">
              <audio src={audioURL} controls className="w-full" />
              <div className="text-xs text-base-content/50 mt-1">
                {recordingTime}s
              </div>
              <motion.button
                onClick={removeAudio}
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
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
          disabled={isSendingImage}
        />
        
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
            className={`btn btn-ghost btn-sm btn-circle ${
              isRecording ? "text-error" : "text-base-content/70 hover:text-secondary"
            }`}
            onClick={isRecording ? stopRecording : startRecording}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSendingImage}
          >
            {isRecording ? (
              <StopCircle size={20} className="animate-pulse" />
            ) : (
              <Mic size={20} />
            )}
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

        <div className="flex-1 relative">
          <motion.input
            type="text"
            className={`w-full input input-bordered rounded-full pl-4 pr-12 transition-all ${
              isFocused ? "input-primary border-2" : ""
            }`}
            placeholder={isRecording ? `Recording... ${recordingTime}s` : "Type a message..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSendingImage || isRecording}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            animate={{
              paddingRight: isFocused || text ? '3.5rem' : '4.5rem'
            }}
          />
          

        </div>

        <motion.button
          type="submit"
          className={`btn btn-circle ${
            (text.trim() || imagePreview || audioURL) 
              ? "btn-primary text-primary-content" 
              : "btn-ghost text-base-content/30"
          }`}
          disabled={(!text.trim() && !imagePreview && !audioURL) || isSendingImage || isRecording}
          whileHover={ (text.trim() || imagePreview || audioURL) ? { scale: 1.05 } : {} }
          whileTap={ (text.trim() || imagePreview || audioURL) ? { scale: 0.95 } : {} }
        >
          {isSendingImage ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <Send size={20} />
          )}
        </motion.button>
      </form>

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