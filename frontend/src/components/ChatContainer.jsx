import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { useWallpaperStore } from "../store/useWallpaperStore";
import UserProfileView from "./UserProfileView"; // Add this import

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    viewingProfile, // Add this
    setViewingProfile, // Add this
  } = useChatStore();
  const { authUser } = useAuthStore();
  const { selectedWallpaper, blurIntensity, brightness } = useWallpaperStore();
  const messagesEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col bg-base-100 rounded-lg border border-base-300 overflow-hidden">
        <ChatHeader />
        <div className="p-4">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-base-100 rounded-xl overflow-hidden border border-base-300">
      <ChatHeader />

      <div 
        className="flex-1 overflow-y-auto p-4"
        style={{
          backgroundImage: selectedWallpaper.url ? `url(${selectedWallpaper.url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: selectedWallpaper.url 
            ? `brightness(${brightness}) blur(${blurIntensity})` 
            : undefined,
          WebkitFilter: selectedWallpaper.url 
            ? `brightness(${brightness}) blur(${blurIntensity})` 
            : undefined,
          isolation: 'isolate'
        }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="max-w-md space-y-2">
              <div className="text-5xl mb-4">👋</div>
              <h3 className="text-xl font-bold">Start the conversation</h3>
              <p className="text-base-content/70">
                Say hello to {selectedUser.fullName} and start chatting on Flary!
              </p>
              <div className="mt-6 p-4 bg-base-100 rounded-lg border border-base-300">
                <p className="font-mono text-sm">"Hey, I'm using Flary!"</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
              >
                {message.senderId !== authUser._id && (
                  <div className="avatar self-end mr-2 mb-1">
                    <div className="w-8 h-8 rounded-full border-2 border-base-100">
                      <img
                        src={selectedUser.profilePic || "/avatar.png"}
                        alt="profile pic"
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col max-w-[75%]">
                  <div
                    className={`px-4 py-2 rounded-xl break-words whitespace-pre-wrap ${
                      message.senderId === authUser._id
                        ? "bg-primary text-primary-content"
                        : "bg-base-100/90 text-base-content shadow-sm border border-base-200/50"
                    }`}
                  >
                    {message.image && (
                      <div className="mb-2 cursor-pointer" onClick={() => setSelectedImage(message.image)}>
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="max-w-full max-h-60 rounded-lg object-contain"
                        />
                        {message.isSending && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <span className="loading loading-spinner loading-xs"></span>
                          </div>
                        )}
                      </div>
                    )}

                    {message.voice && (
                      <div className={`mb-1 ${message.senderId === authUser._id ? 'items-end' : 'items-start'}`}>
                        <div className={`flex flex-col ${message.senderId === authUser._id ? 'items-end' : 'items-start'}`}>
                          <audio 
                            src={message.voice} 
                            controls 
                            className={`w-full max-w-[220px] h-8 ${message.senderId === authUser._id ? 
                              'audio-primary' : 
                              'audio-base'}`}
                          />
                          <div className={`text-xs mt-0.5 ${
                            message.senderId === authUser._id ? 
                              'text-primary-content/70' : 
                              'text-base-content/70'
                          }`}>
                            {message.duration}s
                          </div>
                        </div>
                      </div>
                    )}

                    {message.text && <p className="text-sm md:text-base">{message.text}</p>}
                  </div>

                  <div
                    className={`text-xs mt-1 ${
                      message.senderId === authUser._id ? "text-right text-primary-content/70" : "text-left text-base-content/50"
                    }`}
                  >
                    {message.isSending ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      formatMessageTime(message.createdAt)
                    )}
                    {message.senderId === authUser._id && (
                      <span className="ml-1">
                          {message.isRead ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <MessageInput />

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl h-[90vh] flex flex-col">
            <div className="flex justify-end">
              <button 
                className="btn btn-sm btn-circle"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <img 
                src={selectedImage} 
                alt="Full size" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="modal-action">
              <a 
                href={selectedImage} 
                download 
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}

      {/* User Profile View Modal */}
      {viewingProfile && <UserProfileView />}
    </div>
  );
};

export default ChatContainer;