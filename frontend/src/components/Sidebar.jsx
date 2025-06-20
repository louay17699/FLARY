import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = () => {
  const { 
    getUsers, 
    users, 
    selectedUser, 
    setSelectedUser, 
    isUsersLoading,
    searchQuery,
    setSearchQuery
  } = useChatStore(); 

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = (users || [])
    .filter(user => 
      showOnlineOnly 
        ? (onlineUsers || []).includes(user._id) 
        : true
    )
    .filter(user => 
      user.fullName.toLowerCase().includes((searchQuery || '').toLowerCase())
    );

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-16 lg:w-72 border-r border-base-300 flex flex-col bg-gradient-to-b from-base-100 to-base-200/50">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-2 sm:p-4 space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <Users className="size-5 sm:size-6 text-primary" />
            <span className="hidden lg:block font-medium">Contacts</span>
          </div>
        </div>
        
        {/* Search - hidden on mobile */}
        <div className="hidden lg:block">
          <input
            type="text"
            placeholder="Search contacts..."
            className="input input-bordered input-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Online toggle - hidden on mobile */}
        <div className="hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({(onlineUsers?.length || 1) - 1} online)
          </span>
        </div>
      </div>

      {/* Mobile view - avatars only */}
      <div className="lg:hidden flex flex-col items-center py-2 space-y-3 overflow-y-auto">
        {filteredUsers.slice(0, 8).map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            <button
              onClick={() => setSelectedUser(user)}
              className="rounded-full"
            >
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-10 object-cover rounded-full"
                onError={(e) => {
                  e.target.src = "/avatar.png";
                }}
              />
              {(onlineUsers || []).includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-1 ring-base-100" />
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Desktop view - full contact list */}
      <div className="hidden lg:flex flex-col overflow-y-auto w-full py-2">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <button
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-2 sm:p-3 mx-1 flex items-center gap-3 rounded-lg
                transition-all duration-200
                ${selectedUser?._id === user._id 
                  ? "bg-primary/10 border-l-4 border-primary" 
                  : "hover:bg-base-300/50"}
              `}
            >
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-10 sm:size-12 object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = "/avatar.png";
                  }}
                />
                {(onlineUsers || []).includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-2.5 sm:size-3 bg-green-500 rounded-full ring-1 sm:ring-2 ring-base-100 animate-pulse" />
                )}
              </div>

              <div className="text-left min-w-0 flex-1 hidden sm:block">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-xs sm:text-sm text-zinc-400 flex items-center gap-1">
                  {(onlineUsers || []).includes(user._id) ? (
                    <>
                      <span className="size-1.5 sm:size-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span>Online</span>
                    </>
                  ) : (
                    "Offline"
                  )}
                </div>
              </div>
            </button>
          </motion.div>
        ))}

        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-8 px-4 text-center"
          >
            <Users className="size-8 sm:size-10 text-zinc-400 mb-2" />
            <div className="text-zinc-400 font-medium">No contacts found</div>
            {showOnlineOnly && (
              <button 
                onClick={() => setShowOnlineOnly(false)}
                className="text-sm text-primary mt-2 hover:underline"
              >
                Show all contacts
              </button>
            )}
          </motion.div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;