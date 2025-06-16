import { Icons } from "../../atoms/Icons";

interface PopupHeaderProps {
  title: string;
  onClose: () => void;
}

export function PopupHeader({ title, onClose }: PopupHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Close popup"
      >
        <Icons.Close className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
} 