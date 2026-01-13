import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MainContainerProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  isEmpty?: boolean;
  error?: string;
}

export const TabLayoutContent = ({
  title,
  action,
  children,
  isEmpty,
  error,
}: MainContainerProps) => {
  return (
    <div className="p-4 md:px-8">
      <div className="flex flex-row justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action && <div>{action}</div>}
      </div>
      {!isEmpty && !error && <div>{children}</div>}
      {isEmpty && !error && (
        <div className="pb-4">
          <Alert>
            <AlertTitle>No data</AlertTitle>
            <AlertDescription>
              You don't have any data yet. Please add some data to get started.
            </AlertDescription>
          </Alert>
        </div>
      )}
      {error && (
        <div className="pb-4">
          <Alert variant="destructive">
            <AlertTitle>ERROR</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};
