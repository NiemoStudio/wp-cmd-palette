import { usePages } from "@/hooks/usePages";
import PageItem from "@/components/modules/PageItem";
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Page } from "@/types";
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const Pages = () => {
  const {
    isLoading,
    isPinning,
    isUnpinning,
    pages,
    pinnedPages,
    pinPage,
    reorderPages,
    reorderUnpinnedPages,
    togglePageVisibility,
    unpinPage,
    updatePageColor,
    updatePageIcon
  } = usePages();

  // Local state for smooth updates
  const [localUnpinnedPages, setLocalUnpinnedPages] = useState<Page[]>([]);
  const [localPinnedPages, setLocalPinnedPages] = useState<Page[]>([]);

  useEffect(() => {
    const filtered = pages?.filter((page: Page) =>
      !pinnedPages?.some((pinned: Page) => pinned.id === page.id)
    ) || [];
    setLocalUnpinnedPages(filtered);
  }, [pages, pinnedPages]);

  useEffect(() => {
    if (pinnedPages) {
      setLocalPinnedPages(pinnedPages);
    }
  }, [pinnedPages]);

  const handlePinnedDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Optimistically update local state
      const oldIndex = localPinnedPages.findIndex((p) => p.id === active.id);
      const newIndex = localPinnedPages.findIndex((p) => p.id === over.id);

      const newOrder = [...localPinnedPages];
      const [movedItem] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedItem);

      setLocalPinnedPages(newOrder);

      // Update backend
      reorderPages(active.id as number, over.id as number);
    }
  };

  const handleUnpinnedDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Optimistically update local state
      const oldIndex = localUnpinnedPages.findIndex((p) => p.id === active.id);
      const newIndex = localUnpinnedPages.findIndex((p) => p.id === over.id);

      const newOrder = [...localUnpinnedPages];
      const [movedItem] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedItem);

      setLocalUnpinnedPages(newOrder);

      // Update backend
      reorderUnpinnedPages(active.id as number, over.id as number);
    }
  };

  const PageSkeleton = () => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm shadow-black/2">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-9" />
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
        </div>

        <Skeleton className="h-6 w-32" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="size-9" />
        <Skeleton className="size-9" />
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200 mb-5 text-yellow-800 shadow-sm shadow-black/3">
          Select pages to pin at the top of your command palette results.
          Drag and drop to reorder them.
        </div>

        <div className="space-y-4">
          <h3 className="mb-3!">Pinned</h3>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <PageSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {pinnedPages?.length === 0 && (
                <div className="text-gray-500">
                  There are no pages pinned yet, <br />
                  Click the <strong>Pin</strong> button on a page to pin it.
                </div>
              )}

              <DndContext onDragEnd={handlePinnedDragEnd}>
                <SortableContext
                  items={localPinnedPages.map(p => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {localPinnedPages.map((page: Page) => (
                    <PageItem
                      key={page.id}
                      action={{
                        disabled: isUnpinning,
                        handleClick: () => unpinPage(page.id),
                        label: "Unpin",
                        variant: "outline"
                      }}
                      page={page}
                      onColorChange={(color) => updatePageColor(page.id, color)}
                      onIconChange={(icon) => updatePageIcon(page.id, icon)}
                      onVisibilityToggle={() => togglePageVisibility(page.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </>
          )}

          <h3 className="mb-3!">All Pages</h3>

          {isLoading ? (
            <div className="grid gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <PageSkeleton key={i} />
              ))}
            </div>
          ) : (
            <DndContext onDragEnd={handleUnpinnedDragEnd}>
              <SortableContext
                items={localUnpinnedPages.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid gap-3">
                  {localUnpinnedPages.map((page: Page) => (
                    <PageItem
                      key={page.id}
                      action={{
                        disabled: isPinning,
                        handleClick: () => pinPage(page.id),
                        label: "Pin"
                      }}
                      page={page}
                      onColorChange={(color) => updatePageColor(page.id, color)}
                      onIconChange={(icon) => updatePageIcon(page.id, icon)}
                      onVisibilityToggle={() => togglePageVisibility(page.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </>
  );
};

export default Pages;
