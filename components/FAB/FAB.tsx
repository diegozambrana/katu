import { Button } from "@/components/ui/button"
import { FC } from "react";

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
}

export const FAB: FC<FloatingActionButtonProps> = ({ icon, onClick }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 cursor-pointer"> {/* z-50 para que esté por encima */}
      <Button size="icon" className="rounded-full h-14 w-14" onClick={onClick}>
        {icon}
      </Button>
    </div>
  );
}
