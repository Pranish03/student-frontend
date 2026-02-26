import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronForward } from "react-icons/io5";

export const CollapsibleMenu = ({
  icon: Icon,
  size,
  label,
  defaultOpen = false,
  children,
  className = "",
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={className}>
      <button
        className="font-medium text-base px-3 py-1.5 rounded-lg transition-colors 
        ease-linear cursor-pointer w-full hover:bg-green-700/5 flex justify-between items-center"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="flex items-center gap-3">
          {Icon && <Icon size={size} />}
          {label}
        </span>

        <motion.span animate={{ rotate: open ? 90 : 0 }}>
          <IoChevronForward size={18} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="space-y-1 border-l border-gray-200 ml-4.5 pl-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
