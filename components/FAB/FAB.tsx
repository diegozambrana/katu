import { Button } from "@/components/ui/button";
import { FC } from "react";

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  className?: string;
  onClick: () => void;
}

export const FAB: FC<FloatingActionButtonProps> = ({ icon, className = "", onClick }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 cursor-pointer">
      <Button
        size="icon"
        className={`rounded-full h-14 w-14 text-white shadow-lg ${className}`}
        onClick={onClick}
      >
        {icon}
      </Button>
    </div>
  );
};
