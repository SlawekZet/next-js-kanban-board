import { useKanbanTaskManagerContext } from '@/app/lib/contexts/KanbanTaskManagerContext';
import { TableCellsIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { CreateBoardForm } from '../modals/forms/CreateBoardForm';
import { Modal } from '../modals/Modal';
import { Board } from '../utils/BoardInterfaces';
import { Button } from '../utils/buttons/Button';
import ReactDOM from 'react-dom';

export const BoardList = () => {
  const { setBoardToRender, boards, activeBoard, setActiveBoard, setError } =
    useKanbanTaskManagerContext();

  useEffect(() => {
    setActiveBoard(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBoardClick = (index: number, e: Board) => {
    setActiveBoard(index);
    setBoardToRender(e);
  };

  const handleCreateBoardClick = () => {
    const modal = document.querySelector<HTMLDialogElement>('#ModalBoard');
    if (modal) {
      modal.showModal();
    }
    setError('');
  };

  return (
    <>
      <div className="py-4 w-full">
        <p className="text-[12px] font-bold text-gray3 tracking-[3px] pb-6 pl-8 ">
          ALL BOARDS ({boards.length})
        </p>
        {!boards.length
          ? null
          : boards.map((e, index) => (
              <Button
                key={index}
                onClick={() => handleBoardClick(index, e)}
                className={
                  activeBoard === index
                    ? 'flex flex-row py-3 pr-3 items-center font-bold text-white bg-violet2 gap-4 w-5/6 rounded-r-full pl-8 text-m '
                    : 'flex flex-row py-3 pr-3 items-center font-bold text-gray3 gap-4 pl-8 text-m'
                }
              >
                <TableCellsIcon
                  fill={activeBoard === index ? '#FFFFFF' : '#828FA3'}
                  className="size-6 flex-shrink-0"
                />
                <p className="md:max-w-[120px] max-w-[160px] break-words text-left">
                  {e.name}
                </p>
              </Button>
            ))}
        <Button
          className="flex flex-row py-2 items-center text-violet2 font-bold gap-4 pl-8 text-m"
          onClick={handleCreateBoardClick}
        >
          <TableCellsIcon fill="#635FC7" className="size-6" />
          <p>+ Create New Board</p>
        </Button>
        {ReactDOM.createPortal(
          <Modal id="ModalBoard">
            <CreateBoardForm modalId="ModalBoard" />
          </Modal>,
          document.body
        )}
      </div>
    </>
  );
};
