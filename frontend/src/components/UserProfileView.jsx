import { motion } from "framer-motion";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, User, Calendar, X } from "lucide-react";
import { formatRelativeTime } from "../lib/formatTime";

const UserProfileView = () => {
  const { selectedUser, setViewingProfile } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser?._id);

  if (!selectedUser) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
      onClick={() => setViewingProfile(false)}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-base-100 rounded-box shadow-2xl w-full max-w-xs sm:max-w-md max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setViewingProfile(false)}
          className="btn btn-circle btn-ghost btn-sm absolute right-2 sm:right-4 top-2 sm:top-4 z-10"
          aria-label="Close profile"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="p-4 sm:p-6">
          {/* Profile header */}
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative">
              <div className="avatar">
                <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full relative ring-3 sm:ring-4 ring-offset-3 sm:ring-offset-4 ring-offset-base-100"
                  style={{
                    ringColor: isOnline ? '#10b981' : '#9ca3af',
                  }}
                >
                  <img
                    src={selectedUser.profilePic || "/avatar.png"}
                    alt={selectedUser.fullName}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              
              {isOnline && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: 1.1, opacity: 0 }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 rounded-full border-2 sm:border-4 border-green-500 pointer-events-none"
                />
              )}
            </div>
            
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-base-content">  
                {selectedUser.fullName}
              </h2>
            </div>
            
            <div className="relative inline-flex items-center">
              {isOnline ? (
                <>
                  <span className="flex size-2 sm:size-3 relative mr-1 sm:mr-2">
                    <span className="relative inline-flex rounded-full size-2 sm:size-3 bg-green-500" />
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-green-600">Online now</span>
                </>
              ) : (
                <>
                  <span className="size-2 sm:size-3 rounded-full bg-gray-400 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-gray-500">
                    {formatRelativeTime(selectedUser.lastOnline)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Profile details */}
          <div className="space-y-3 sm:space-y-4">
            <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="card-body p-3 sm:p-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 rounded-box bg-primary/10 text-primary">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-base-content/70">Email</p>
                    <p className="font-medium text-base sm:text-lg">{selectedUser.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedUser.bio && (
              <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="card-body p-3 sm:p-5">
                  <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-base-content">About</h3>
                  <p className="text-sm sm:text-base text-base-content/90 whitespace-pre-line">
                    {selectedUser.bio}
                  </p>
                </div>
              </div>
            )}

            <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="card-body p-3 sm:p-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 rounded-box bg-primary/10 text-primary">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-base-content/70">Member since</p>
                    <p className="font-medium text-base sm:text-lg">
                      {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 sm:mt-8 flex justify-center gap-2 sm:gap-4">
            <button 
              onClick={() => setViewingProfile(false)}
              className="btn btn-primary btn-sm sm:btn-md px-4 sm:px-8"
            >
              Close
            </button>
            <button 
              className="btn btn-outline btn-sm sm:btn-md px-4 sm:px-8"
              onClick={() => {
                setViewingProfile(false);
              }}
            >
              Message
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserProfileView;