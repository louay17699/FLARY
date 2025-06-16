import { Users, Search } from "lucide-react";
import { motion } from "framer-motion";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-16 lg:w-72 border-r border-base-300/50 bg-base-100/80 backdrop-blur-sm flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300/50 w-full p-2 sm:p-4 space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <Users className="size-5 sm:size-6 text-primary" />
            <div className="hidden lg:block skeleton h-5 sm:h-6 w-20 sm:w-24 rounded-md" />
          </div>
          <div className="lg:hidden skeleton size-6 sm:size-8 rounded-md" />
        </div>

        {/* Search skeleton */}
        <div className="hidden lg:block">
          <div className="skeleton h-7 sm:h-8 w-full rounded-md" />
        </div>

        {/* Toggle skeleton */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="skeleton h-4 sm:h-5 w-20 sm:w-24 rounded-md" />
          <div className="skeleton h-3 sm:h-4 w-10 sm:w-12 rounded-md" />
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="lg:hidden flex flex-col items-center py-2 sm:py-3 space-y-3 sm:space-y-4">
        {skeletonContacts.slice(0, 6).map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="skeleton size-8 sm:size-10 rounded-full" />
          </motion.div>
        ))}
      </div>

      {/* Desktop skeleton */}
      <div className="hidden lg:flex flex-col overflow-y-auto w-full py-2">
        {skeletonContacts.map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="w-full p-2 mx-1 rounded-lg flex items-center gap-3"
          >
            <div className="skeleton size-10 sm:size-12 rounded-full" />
            <div className="text-left min-w-0 flex-1 space-y-1 sm:space-y-2">
              <div className="skeleton h-3 sm:h-4 w-3/4 rounded-md" />
              <div className="skeleton h-2 sm:h-3 w-1/2 rounded-md" />
            </div>
          </motion.div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;