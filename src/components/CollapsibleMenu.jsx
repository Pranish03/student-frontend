/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronForward } from "react-icons/io5";
import { Button } from "./Button";

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
      <Button
        variant="ghost"
        className="w-full flex justify-between items-center text-zinc-900"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="flex items-center gap-3">
          {Icon && <Icon size={size} />}
          {label}
        </span>

        <motion.span animate={{ rotate: open ? 90 : 0 }}>
          <IoChevronForward size={18} />
        </motion.span>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className="border-l border-zinc-200 ml-4.5 pl-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
