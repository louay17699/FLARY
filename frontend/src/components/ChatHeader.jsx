import { X, MoreVertical, Phone, Video, Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { motion } from "framer-motion";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 py-3 border-b border-base-300/50 bg-base-100/80 backdrop-blur-md"
    >
      <div className="flex items-center justify-between">
     
        <div className="flex items-center gap-3 flex-1 min-w-0">
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="avatar">
              <div className="size-12 rounded-full relative ring-2 ring-offset-2 ring-offset-base-100"
                style={{
                  ringColor: isOnline ? '#10b981' : '#9ca3af',
                  transition: 'ring-color 0.3s ease'
                }}
              >
                <img 
                  src={selectedUser.profilePic || "/avatar.png"} 
                  alt={selectedUser.fullName}
                  className="object-cover"
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
                className="absolute inset-0 rounded-full border-2 border-green-500 pointer-events-none"
              />
            )}
          </motion.div>

          
          <div className="flex-1 min-w-0">
            <motion.div whileHover={{ x: 2 }}>
              <h3 className="font-semibold text-lg truncate">
                {selectedUser.fullName}
              </h3>
              <p className={`text-sm flex items-center gap-1.5 ${
                isOnline 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-base-content/60"
              }`}>
                <motion.span 
                  animate={{
                    scale: isOnline ? [1, 1.1, 1] : 1
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className={`inline-block size-2.5 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-gray-500"
                  }`}
                />
                {isOnline ? (
                  <span className="flex items-center gap-1">
                    <span>Online</span>
                    <motion.span
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-xs"
                    >
                      • Active now
                    </motion.span>
                  </span>
                ) : (
                  "Offline"
                )}
              </p>
            </motion.div>
          </div>
        </div>

      
        <div className="flex items-center gap-1">
         
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-ghost btn-sm btn-square text-primary/80 hover:text-primary hover:bg-primary/10"
          >
            <Phone size={18} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-ghost btn-sm btn-square text-secondary/80 hover:text-secondary hover:bg-secondary/10"
          >
            <Video size={18} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-base-content"
          >
            <Search size={18} />
          </motion.button>
          
         
          <div className="h-6 w-px bg-base-300 mx-1"></div>
          
          
          <motion.button 
            onClick={() => setSelectedUser(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="btn btn-ghost btn-sm btn-square text-error/80 hover:text-error hover:bg-error/10"
          >
            <X size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatHeader;