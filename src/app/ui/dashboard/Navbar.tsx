'use client';
import { useKanbanTaskManagerContext } from '@/app/lib/contexts/KanbanTaskManagerContext';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Button } from '../utils/buttons/Button';
import { ButtonPrimaryL } from '../utils/buttons/ButtonPrimaryL';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import CreateTaskForm from '../modals/forms/CreateTaskForm';
import { DeleteElement } from '../modals/forms/DeleteElement';
import { EditBoardForm } from '../modals/forms/EditBoardForm';
import { Modal } from '../modals/Modal';

export const Navbar = () => {
  const {
    boardToRender,
    isSidebarHidden,
    setIsBoardMenuVisible,
    isBoardMenuVisible,
  } = useKanbanTaskManagerContext();

  const handleCreateNewTaskClick = () => {
    const modal = document.querySelector<HTMLDialogElement>('#modalTask');
    if (modal) {
      modal.showModal();
    }
  };

  const handleMenuClick = () => {
    setIsBoardMenuVisible((prev) => !prev);
  };

  const handleModalClick = (modalType: 'edit' | 'delete') => {
    const modal = document.querySelector<HTMLDialogElement>(
      `#${modalType}${boardToRender?.id}`
    );
    if (modal) {
      modal.showModal();
    }
    setIsBoardMenuVisible(false);
  };
  const { resolvedTheme } = useTheme();
  return (
    <div className="flex flex-row justify-between w-full h-[80px] md:h-[80px] border-b-[1px] border-gray2 bg-white dark:bg-gray5 dark:border-gray4 dark:text-white">
      <div className=" flex flex-row items-center justify-center">
        <div className="">
          {isSidebarHidden ? (
            resolvedTheme === 'dark' ? (
              <Image
                width={200}
                height={85}
                src="/logo-light.svg"
                alt="kanban task manager logotype"
                className="p-6 border-r-[1px] border-gray2 dark:border-gray4"
              />
            ) : (
              <Image
                width={200}
                height={85}
                src="/logo-dark.svg"
                alt="kanban task manager logotype"
                className="p-6 border-r-[1px] border-gray2 dark:border-gray4"
              />
            )
          ) : null}
        </div>
        <h1 className="p-6 md:p-4 font-bold text-xl md:text-lg mob:text-sm flex">
          {boardToRender ? boardToRender.name : 'No board chosen'}
        </h1>
      </div>
      <div className="flex items-center pl-4">
        {boardToRender ? (
          <div className="flex relative">
            <ButtonPrimaryL
              onClick={handleCreateNewTaskClick}
              className="md:text-sm md:h-10 md:px-4 md:w-40 w-48 "
            >
              + Add new Task
            </ButtonPrimaryL>
            <Button onClick={handleMenuClick} className="px-2">
              <EllipsisVerticalIcon className="size-6" fill="#828FA3" />
            </Button>
            {isBoardMenuVisible && (
              <div className="absolute left-4 top-14 p-6 bg-white dark:bg-gray6 flex flex-col gap-2 items-start w-[180px] shadow-md rounded-md text-sm z-50">
                <Button
                  onClick={() => handleModalClick('edit')}
                  className="text-left dark:text-gray3"
                >
                  Edit Board
                </Button>
                <Button
                  onClick={() => handleModalClick('delete')}
                  className="text-left text-red2"
                >
                  Delete Board
                </Button>
              </div>
            )}
          </div>
        ) : null}

        <Modal id="modalTask">
          <CreateTaskForm modalId="modalTask" />
        </Modal>
        <Modal id={`delete${boardToRender?.id}`}>
          <DeleteElement
            element="board"
            name={boardToRender?.name}
            modalId={`delete${boardToRender?.id}`}
            elementId={boardToRender?.id}
            boardId={boardToRender?.id}
          />
        </Modal>
        {boardToRender ? (
          <Modal id={`edit${boardToRender.id}`}>
            <EditBoardForm
              modalId={`edit${boardToRender.id}`}
              // board={boardToRender}
            />
          </Modal>
        ) : null}
      </div>
    </div>
  );
};
