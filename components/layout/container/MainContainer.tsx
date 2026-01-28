import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Breadcrumb } from "@/components/Breadcrumb";

interface MainContainerProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  isEmpty?: boolean;
  error?: string;
  loading?: boolean;
  breadcrumb?: string;
}

export const MainContainer = ({
  title,
  action,
  children,
  isEmpty,
  error,
  loading = false,
  breadcrumb,
}: MainContainerProps) => {
  if (loading) {
    return (
      <div className="p-4 md:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 md:px-8">
      {breadcrumb && <Breadcrumb type={breadcrumb} />}
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
              You don&apos;t have any data yet. Please add some data to get started.
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
