import { MessageSquare, CornerUpRight, PenTool, Coffee, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

const NoChatSelected = () => {
  const constraintsRef = useRef(null);
  const floatingBubbles = Array(8).fill(null);

  return (
    <div className="w-full h-full flex flex-1 items-center justify-center p-4 sm:p-8 overflow-hidden">
      <div 
        ref={constraintsRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {floatingBubbles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10 dark:bg-primary/20"
            style={{
              width: Math.random() * 30 + 15,
              height: Math.random() * 30 + 15,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 80 - 40],
              x: [0, Math.random() * 50 - 25],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xs sm:max-w-md md:max-w-2xl text-center"
      >
        <motion.div 
          className="absolute -top-8 sm:-top-12 -left-6 sm:-left-10 rotate-12 opacity-70 dark:opacity-50"
          animate={{
            rotate: [12, 8, 12, 16, 12],
            y: [0, -5, 0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width="80" height="80" viewBox="0 0 100 100" className="text-primary/30 dark:text-primary/20">
            <path 
              d="M20,15 Q30,5 50,10 Q70,5 80,15 L85,50 Q90,70 70,80 L50,85 Q30,80 15,50 Z" 
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <motion.div
          className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-base-100 dark:bg-base-200 border-2 border-base-300 dark:border-base-300/50 rounded-full shadow-lg mb-6 sm:mb-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary dark:text-primary-focus" />
          </motion.div>
          <motion.h1 
            className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary dark:from-primary-focus dark:to-secondary-focus text-transparent bg-clip-text font-handwritten tracking-wide"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%'] 
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            style={{ 
              backgroundSize: '200% 100%' 
            }}
          >
            Hey there, Welcome To FLARY!
          </motion.h1>
        </motion.div>

        <motion.div 
          className="space-y-3 sm:space-y-4 text-sm sm:text-lg text-base-content/80 dark:text-base-content/60 mb-6 sm:mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.4,
              },
            },
          }}
        >
          <motion.p 
            className="flex items-center justify-center gap-1 sm:gap-2"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { type: "spring", stiffness: 100 }
              },
            }}
          >
            <motion.span
              animate={{ 
                x: [0, 5, 0],
                transition: { 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              }}
            >
              <CornerUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-secondary rotate-180" />
            </motion.span>
            <span>Pick a conversation from the sidebar</span>
          </motion.p>

          <motion.p 
            className="flex items-center justify-center gap-1 sm:gap-2"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { type: "spring", stiffness: 100, delay: 0.2 }
              },
            }}
          >
            <motion.span
              animate={{ 
                rotate: [0, 15, 0],
                transition: { 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              }}
            >
              <PenTool className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            </motion.span>
            <span>Or start a brand new chat adventure</span>
          </motion.p>
        </motion.div>

        <motion.div 
          className="group relative mt-6 sm:mt-8 inline-block"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div 
            className="absolute -inset-2 sm:-inset-3 bg-primary/10 dark:bg-primary/20 rounded-xl transform rotate-1"
            animate={{
              rotate: [1, 3, -1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="relative flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-base-100 dark:bg-base-200 border-2 border-base-300 dark:border-base-300/50 rounded-xl shadow-md"
            whileHover={{ 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              y: -2
            }}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
          >
            <motion.span
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-500" />
            </motion.span>
            <span className="text-sm sm:text-base font-medium">Pro tip: Grab a coffee while you wait!</span>
            <motion.span
              className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div 
          className="absolute -bottom-6 sm:-bottom-8 -right-6 sm:-right-8 -rotate-12 opacity-70 dark:opacity-50"
          animate={{
            rotate: [-12, -8, -12, -16, -12],
            y: [0, -5, 0, 5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width="70" height="70" sm:width="100" sm:height="100" viewBox="0 0 100 100" className="text-secondary/30 dark:text-secondary/20">
            <path 
              d="M15,20 Q5,30 10,50 Q5,70 15,80 L50,85 Q70,90 80,70 L85,50 Q90,30 70,20 Z" 
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NoChatSelected;