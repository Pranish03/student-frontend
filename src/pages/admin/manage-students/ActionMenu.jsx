import { Button } from "../../../components/Button";

export const ActionMenu = ({ menu, menuRef, onClose }) => {
  if (!menu) return null;

  return (
    <div
      ref={menuRef}
      style={{ top: menu.top, right: menu.right }}
      className="fixed z-50 flex flex-col bg-white border border-black/20 rounded-[10px] shadow p-1 text-base"
    >
      <Button
        variant="ghost"
        className="text-left text-gray-900"
        onClick={onClose}
      >
        Edit
      </Button>
      <Button
        variant="ghost"
        className="text-left text-gray-900"
        onClick={onClose}
      >
        Toggle Status
      </Button>
      <Button
        variant="ghost-danger"
        className="text-left text-gray-900"
        onClick={onClose}
      >
        Delete
      </Button>
    </div>
  );
};
