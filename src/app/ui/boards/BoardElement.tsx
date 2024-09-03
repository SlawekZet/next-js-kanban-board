import { useKanbanTaskManagerContext } from '@/app/lib/contexts/KanbanTaskManagerContext';
import { Button } from '../utils/buttons/Button';
import { CreateColumnForm } from '../modals/forms/CreateColumn';
import { Modal } from '../modals/Modal';
import { TaskList } from './TaskList';
import { useEffect, useRef, useState } from 'react';

export const BoardElement = () => {
  const { boardToRender, isSidebarHidden } = useKanbanTaskManagerContext();

  const handleCreateNewColumnClick = () => {
    const modal = document.querySelector<HTMLDialogElement>('#newColumnModal');
    if (modal) {
      modal.showModal();
    }
  };

  // Below checks if the content is overflowing horizontally. If no, then the bottom padding is smaller, if yes, then the bottom padding is bigger.

  const boardRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const container = boardRef.current;

    const checkOverflow = () => {
      if (container) {
        setIsOverflowing(container.scrollWidth > container.clientWidth);
      }
    };

    checkOverflow(); // Initial check

    // Event listeners for window resize and mutation
    const handleResize = () => {
      checkOverflow();
    };

    let observer: MutationObserver | null = null;
    if (container) {
      observer = new MutationObserver(() => {
        checkOverflow();
      });
      observer.observe(container, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
    };
  }, []);

  // Here the above overflow check ends

  return (
    <div
      ref={boardRef}
      className={`flex flex-row gap-6 px-6 pt-6 h-[calc(100vh-80px)] ${
        isOverflowing ? '' : ''
      } ${
        isSidebarHidden
          ? 'max-w-full'
          : 'max-w-[calc(100vw-300px)] md:max-w-[calc(100vw-250px)] mob:max-w-full'
      } overflow-auto`}
    >
      {boardToRender?.columns ? (
        boardToRender.columns.map((e) => (
          <TaskList
            columnId={e.id}
            name={e.name}
            tasks={e.tasks}
            key={e.id}
            boardId={boardToRender.id}
          />
        ))
      ) : (
        <p className="dark:text-gray3 ">No board selected</p>
      )}
      {boardToRender ? (
        <Button
          className="w-[280px] min-w-[280px] bg-gray2 rounded-md mt-[52px] text-xl font-bold text-gray3 dark:bg-gray5"
          onClick={handleCreateNewColumnClick}
        >
          + New Column
        </Button>
      ) : null}
      <Modal id="newColumnModal">
        <CreateColumnForm modalId="newColumnModal" />
      </Modal>
    </div>
  );
};
