"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableProps } from "./types";
import { TableContent } from "./TableContent";
import { TableLoadingState } from "./TableLoadingState";
import { TableErrorState } from "./TableErrorState";
import { TablePagination } from "./TablePagination";

export function Table<T = Record<string, unknown>>({
  data,
  columns,
  actions = [],
  title,
  description,
  headerActions = [],
  cardTitle,
  cardDescription,
  isLoading = false,
  error = null,
  onRetry,
  emptyMessage = "Nie znaleziono danych",
  emptyDescription = "Brak danych do wyświetlenia.",
  pagination,
  onPageChange,
  minItemsForPagination = 10,
  loadingRows = 5,
  showCard = true,
}: TableProps<T>) {
  // Generate card description based on loading state and data
  const getCardDescription = () => {
    if (cardDescription) return cardDescription;
    if (description) return description;
    if (isLoading) return "Loading...";
    if (pagination) return `${pagination.total} items total`;
    return `${data.length} items`;
  };

  // Get the main title (prefer title over cardTitle)
  const getMainTitle = () => {
    return title || cardTitle;
  };

  // Main content component
  const MainContent = () => {
    // Error state
    if (error) {
      return showCard ? (
        <Card>
          <CardContent className="p-6">
            <TableErrorState error={error} onRetry={onRetry} />
          </CardContent>
        </Card>
      ) : (
        <TableErrorState error={error} onRetry={onRetry} />
      );
    }

    // Loading state
    if (isLoading) {
      const loadingContent = (
        <>
          <TableLoadingState
            columns={columns}
            actions={actions}
            loadingRows={loadingRows}
          />
          {pagination && onPageChange && (
            <TablePagination
              pagination={pagination}
              onPageChange={onPageChange}
              minItemsForPagination={minItemsForPagination}
            />
          )}
        </>
      );

      return showCard ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                {getMainTitle() && <CardTitle>{getMainTitle()}</CardTitle>}
                <CardDescription>{getCardDescription()}</CardDescription>
              </div>
              {headerActions.length > 0 && (
                <div className="flex space-x-2">
                  {headerActions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant}
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>{loadingContent}</CardContent>
        </Card>
      ) : (
        loadingContent
      );
    }

    // Normal content
    const tableContent = (
      <>
        <TableContent
          data={data}
          columns={columns}
          actions={actions}
          emptyMessage={emptyMessage}
          emptyDescription={emptyDescription}
        />
        {pagination && onPageChange && (
          <TablePagination
            pagination={pagination}
            onPageChange={onPageChange}
            minItemsForPagination={minItemsForPagination}
          />
        )}
      </>
    );

    return showCard ? (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              {getMainTitle() && <CardTitle>{getMainTitle()}</CardTitle>}
              <CardDescription>{getCardDescription()}</CardDescription>
            </div>
            {headerActions.length > 0 && (
              <div className="flex space-x-2">
                {headerActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>{tableContent}</CardContent>
      </Card>
    ) : (
      tableContent
    );
  };

  return <MainContent />;
}
