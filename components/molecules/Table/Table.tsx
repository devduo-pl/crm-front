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
import { TableFilters } from "./TableFilters";

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
  sortable = false,
  sortState,
  onSortChange,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  showFilters = false,
}: TableProps<T>) {
  
  // Helper functions for titles and descriptions
  const getMainTitle = () => {
    return title || cardTitle;
  };

  const getCardDescription = () => {
    return cardDescription || description;
  };

  // Show filters if search functionality is provided
  const shouldShowFilters = showFilters || (searchValue !== undefined && onSearchChange);

  // Main content component
  const MainContent = () => {
    // Error state
    if (error) {
      return (
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
          <CardContent>
            <TableErrorState error={error} onRetry={onRetry} />
          </CardContent>
        </Card>
      );
    }

    // Loading state
    const loadingContent = (
      <div className="space-y-4">
        {shouldShowFilters && searchValue !== undefined && onSearchChange && (
          <TableFilters
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            searchPlaceholder={searchPlaceholder}
          />
        )}
        <TableLoadingState
          columns={columns}
          actions={actions}
          loadingRows={loadingRows}
        />
      </div>
    );

    if (isLoading) {
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
      <div className="space-y-4">
        {shouldShowFilters && searchValue !== undefined && onSearchChange && (
          <TableFilters
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            searchPlaceholder={searchPlaceholder}
          />
        )}
        <TableContent
          data={data}
          columns={columns}
          actions={actions}
          emptyMessage={emptyMessage}
          emptyDescription={emptyDescription}
          sortable={sortable}
          sortState={sortState}
          onSortChange={onSortChange}
        />
        {pagination && onPageChange && (
          <TablePagination
            pagination={pagination}
            onPageChange={onPageChange}
            minItemsForPagination={minItemsForPagination}
          />
        )}
      </div>
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
