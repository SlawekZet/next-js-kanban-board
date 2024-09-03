'use client';
import { useKanbanTaskManagerContext } from '@/app/lib/contexts/KanbanTaskManagerContext';
import {
  EllipsisVerticalIcon,
  ChevronDownIcon,
} from '@heroicons/react/20/solid';
import { Button } from '../utils/buttons/Button';
import { ButtonPrimaryL } from '../utils/buttons/ButtonPrimaryL';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import CreateTaskForm from '../modals/forms/CreateTaskForm';
import { DeleteElement } from '../modals/forms/DeleteElement';
import { EditBoardForm } from '../modals/forms/EditBoardForm';
import { Modal } from '../modals/Modal';
import { useEffect, useState } from 'react';
import MobileMenu from '../modals/forms/MobileMenu';

export const Navbar = () => {
  const {
    boardToRender,
    isSidebarHidden,
    setIsBoardMenuVisible,
    isBoardMenuVisible,
  } = useKanbanTaskManagerContext();

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const isMobile = viewportWidth <= 426;
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCreateNewTaskClick = () => {
    const modal = document.querySelector<HTMLDialogElement>('#modalTask');
    if (modal) {
      modal.showModal();
    }
  };

  const handleMobileMenuClick = () => {
    const modal = document.querySelector<HTMLDialogElement>('#mobileMenu');
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
          {isSidebarHidden || isMobile ? (
            resolvedTheme === 'dark' ? (
              <Image
                width={isMobile ? 75 : 200}
                height={85}
                src={isMobile ? '/logo-mobile.svg' : '/logo-light.svg'}
                alt="kanban task manager logotype"
                className="p-6 border-r-[1px] border-gray2 dark:border-gray4 min-w-[75px]"
              />
            ) : (
              <Image
                width={isMobile ? 50 : 200}
                height={85}
                src={isMobile ? '/logo-mobile.svg' : '/logo-dark.svg'}
                alt="kanban task manager logotype"
                className="p-6 mob:p-5 border-r-[1px] border-gray2 mob:border-none dark:border-gray4 min-w-[75px]"
              />
            )
          ) : null}
        </div>
        <div className="flex">
          <h1 className="p-6 md:p-4 mob:pl-0 mob:pr-2 font-bold text-xl md:text-lg mob:text-lg">
            {boardToRender ? boardToRender.name : 'No board chosen'}
          </h1>
          {/* TODO: make chevron to stick to the left */}
          <button onClick={handleMobileMenuClick} className="flex items-center">
            <ChevronDownIcon className="size-6" fill="#828FA3" />
          </button>
        </div>
      </div>
      <div className="flex items-center pl-4 mob:pl-0 ">
        {boardToRender ? (
          <div className="flex relative">
            <ButtonPrimaryL
              onClick={handleCreateNewTaskClick}
              className="md:text-sm md:h-10 md:px-4 md:w-40 w-48 mob:w-12 mob:text-xl mob:h-8 mob:pt-[9px]"
            >
              {viewportWidth <= 426 ? '+' : '+ Add new Task'}
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
        <Modal id="mobileMenu">
          <MobileMenu />
        </Modal>
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
