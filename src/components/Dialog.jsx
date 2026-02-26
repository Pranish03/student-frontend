import { LuX } from "react-icons/lu";

export const Dialog = ({ heading, desc, close, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
      <div className="bg-white border border-black/30 rounded-2xl w-110 p-3">
        <div className="text-gray-900 flex items-center justify-between mb-2">
          <h3 className="font-semibold text-xl">{heading}</h3>
          <button
            className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer"
            onClick={close}
          >
            <LuX size={20} />
          </button>
        </div>
        <p className="text-base text-gray-800 mb-5">{desc}</p>

        {children}
      </div>
    </div>
  );
};
