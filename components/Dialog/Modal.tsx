import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
}: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 sm:p-6">
        <DialogHeader className="px-6 pt-6 pb-4 sm:px-0 sm:pt-0">
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 sm:px-0">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}