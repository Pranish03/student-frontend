import { NavLink } from "react-router-dom";

export const NavButton = ({ to, className = "", children, ...props }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        isActive ? "text-green-600" : "text-gray-900"
      }
    >
      <button
        className={`
        font-medium text-base px-3 py-1.5 rounded-lg transition-colors ease-linear
        cursor-pointer w-full flex items-center hover:bg-green-700/5
        ${className}
      `}
        {...props}
      >
        {children}
      </button>
    </NavLink>
  );
};
