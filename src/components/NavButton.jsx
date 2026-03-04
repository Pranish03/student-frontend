import { NavLink } from "react-router-dom";
import { Button } from "./Button";

export const NavButton = ({ to, className = "", children, ...props }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        isActive ? "text-green-600" : "text-zinc-900"
      }
    >
      <Button
        variant="ghost"
        className={`w-full flex items-center ${className}`}
        {...props}
      >
        {children}
      </Button>
    </NavLink>
  );
};
