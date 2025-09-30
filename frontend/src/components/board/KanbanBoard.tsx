import React, { useMemo } from "react";
import { DndContext, PointerSensor, TouchSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, useSortable, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import KanbanColumn from "./KanbanColumn";
import { addBoardColumn, updateCard, updateBoard } from "@/services/api";
import { appPrompt } from "@/components/ui/ConfirmProvider";
import { useAuth } from "@/hooks/useAuth";

interface KanbanBoardProps {
  boardId: string;
  columns: Array<{ id: string; title?: string }>;
  cards: any[];
  onCardsChange: (cards: any[]) => void;
  onColumnsChange?: (cols: Array<{ id: string; title?: string }>) => void; // optional callback
}

export default function KanbanBoard({ boardId, columns, cards, onCardsChange, onColumnsChange }: KanbanBoardProps) {
  // sensors include touch + keyboard
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const { token } = useAuth();

  const cardsByColumn = useMemo(() => {
    const map: Record<string, any[]> = {};
    columns.forEach(c => (map[c.id] = []));
    cards.forEach(card => {
      const col = card.status ?? columns[0]?.id;
      if (!map[col]) map[col] = [];
      map[col].push(card);
    });
    return map;
  }, [columns, cards]);

  const handleAddColumn = async () => {
    // prompt for column title (uses ConfirmProvider.appPrompt)
    const title = await appPrompt("Column title", { defaultValue: "New column", title: "Add column", confirmLabel: "Add" });
    if (!title) return;
    try {
      // call backend API to create column and return updated board
      const board = await addBoardColumn(boardId, { title: title.trim() }, token ?? undefined);
      // if parent passed onColumnsChange, use it; else do nothing (caller should update board)
      if (onColumnsChange && board && board.columns) {
        onColumnsChange(board.columns);
      }
    } catch (err: any) {
      console.error("add column failed", err);
      // toast if available
    }
  };

  // helper: check if id is a column id
  const columnIds = useMemo(() => columns.map(c => String(c.id)), [columns]);

  const handleEditColumn = async (colId: string) => {
    const col = columns.find(c => String(c.id) === String(colId));
    if (!col) return;
    const newTitle = await appPrompt("Edit column title", { defaultValue: String(col.title ?? ""), title: "Edit column", confirmLabel: "Save" });
    if (newTitle === null) return;
    const trimmed = String(newTitle).trim();
    if (!trimmed) return;

    const newCols = columns.map(c => (String(c.id) === String(colId) ? { ...c, title: trimmed } : c));
    // optimistic UI
    onColumnsChange?.(newCols);

    try {
      console.debug("[kanban] updateBoard edit column", { boardId, cols: newCols });
      const res = await updateBoard(boardId, { columns: newCols }, token ?? undefined);
      console.debug("[kanban] updateBoard response", res);
    } catch (err: any) {
      console.error("[kanban] Failed to save column title:", err);
      // rollback
      onColumnsChange?.(columns);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // column reorder
    if (columnIds.includes(activeId) && columnIds.includes(overId)) {
      const oldIndex = columns.findIndex((c) => String(c.id) === activeId);
      const newIndex = columns.findIndex((c) => String(c.id) === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      const newColumns = arrayMove(columns, oldIndex, newIndex);
      onColumnsChange?.(newColumns); // optimistic
      try {
        console.debug("[kanban] persist columns order", { boardId, newColumns });
        const res = await updateBoard(boardId, { columns: newColumns }, token ?? undefined);
        console.debug("[kanban] updateBoard reorder response", res);
      } catch (err: any) {
        console.error("[kanban] persist columns order failed", err);
        onColumnsChange?.(columns); // rollback
      }
      return;
    }

    // card move handling (unchanged)...
    const cardId = activeId;
    const destColumnId = overId.endsWith("-drop") ? overId.replace(/-drop$/, "") : overId;
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    if (card.status === destColumnId) return;

    const updated = cards.map(c => (c.id === cardId ? { ...c, status: destColumnId } : c));
    onCardsChange(updated);

    try {
      await updateCard(boardId, cardId, { status: destColumnId }, token ?? undefined);
    } catch (err: any) {
      console.error("[kanban] persist card status failed", err);
      onCardsChange(cards);
    }
  };

  return (
    <div className="overflow-x-auto pb-6">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={columns.map(c => String(c.id))} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-4 items-start" style={{ minWidth: Math.max(800, columns.length * 280) }}>
            {columns.map((column) => {
              // useSortable for column container
              const sortable = useSortable({ id: column.id });
              const transform = sortable.transform ? CSS.Transform.toString(sortable.transform) : undefined;
              const style: React.CSSProperties = {
                transform,
                transition: sortable.transition ?? "transform 180ms ease",
              };

              return (
                <div key={column.id} ref={sortable.setNodeRef} style={style} className="w-80 flex-shrink-0">
                  <div className="bg-white rounded-md p-2 h-full border border-slate-100">
                    <div
                      className="flex justify-between items-center mb-3 px-2 cursor-default select-none"
                      // header hover hint
                    >
                      <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Drag column ${column.title ?? column.id}`}
                          title="Drag to reorder column"
                          className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 active:bg-slate-200 cursor-grab touch-none"
                          {...sortable.attributes}
                          {...(sortable.listeners as any)}
                          style={{ touchAction: "none" }}
                        >
                          <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>

                        <span className="ml-1 truncate">{column.title ?? column.id}</span>
                      </h3>

                      <div className="flex items-center gap-2">
                        <button
                          aria-label={`Edit column ${column.title ?? column.id}`}
                          className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded"
                          onClick={(e) => { e.stopPropagation(); handleEditColumn(column.id); }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    <KanbanColumn
                      boardId={boardId}
                      columnId={column.id}
                      cards={cardsByColumn[column.id] || []}
                      onCardsChange={onCardsChange}
                      columns={columns} // pass board columns so CardFormModal can render all statuses
                    />
                  </div>
                </div>
              );
            })}

            {/* Add column card */}
            <div className="w-72 flex-shrink-0">
              <div className="rounded-md p-3 h-full border-2 border-dashed border-slate-200 flex items-center justify-center bg-white shadow-sm">
                <button
                  onClick={handleAddColumn}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  aria-label="Add column"
                >
                  + Add column
                </button>
              </div>
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}