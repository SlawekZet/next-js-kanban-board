import { handleExitModalClick } from '@/app/lib/actions';
import { useKanbanTaskManagerContext } from '@/app/lib/contexts/KanbanTaskManagerContext';
import { auth } from '@/app/lib/firebase/config';
import { XMarkIcon } from '@heroicons/react/20/solid';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { v4 as uuidv4 } from 'uuid';
import { TaskList } from '../../utils/BoardInterfaces';
import { Button } from '../../utils/buttons/Button';
import { ButtonPrimaryS } from '../../utils/buttons/ButtonPrimaryS';
import { ButtonSecondary } from '../../utils/buttons/ButtonSecondary';
import { ButtonDestructive } from '../../utils/buttons/DestructiveButton';
import { dataSave } from '../../utils/utils';

interface CreateBoardFormProps {
  modalId: string;
}

const initialColumns = [
  { id: uuidv4(), name: '', tasks: [] },
  { id: uuidv4(), name: '', tasks: [] },
];

export const CreateBoardForm: React.FC<CreateBoardFormProps> = ({
  modalId,
}) => {
  const {
    boards,
    setBoards,
    setBoardToRender,
    setActiveBoard,
    error,
    setError,
  } = useKanbanTaskManagerContext();
  const [boardName, setBoardName] = useState('');
  const [columns, setColumns] = useState<TaskList[]>(initialColumns);
  const [user] = useAuthState(auth);

  const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardName(e.target.value);
    setError('');
  };

  const handleColumnNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newColumns = columns.slice();
    newColumns[index].name = e.target.value;
    setColumns(newColumns);
  };

  const handleCreateNewColumn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (columns.length < 20) {
      setColumns([...columns, { id: uuidv4(), name: '', tasks: [] }]);
      setError('');
    } else {
      setError('Maximum number of columns (20) reached');
    }
  };

  const handleDeleteColumn = (
    index: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (columns.length === 1) {
      setError('There must be at least 1 column in a board');
    } else {
      const updatedColumns = columns.slice();
      updatedColumns.splice(index, 1);
      setColumns(updatedColumns);
      setError('');
    }
  };

  const handleCancelAndResetData = () => {
    setColumns(initialColumns);
    setBoardName('');
    setError('');
    handleExitModalClick(modalId);
  };

  const handleCreateBoard = () => {
    const newBoard = {
      id: uuidv4(),
      name: boardName,
      columns: columns,
    };
    const newBoards = [...boards, newBoard];
    setBoards(newBoards);
    setBoardToRender(newBoard);
    setActiveBoard(boards.length);
    setBoardName('');
    setColumns(initialColumns);
    if (user) {
      dataSave(user.uid, newBoards);
    }
  };

  return (
    <form className="flex flex-col" method="dialog">
      <h1 className="font-bold text-lg pb-6 dark:text-white">Add New Board</h1>
      <label
        htmlFor="title"
        className="text-sm font-bold text-gray3 pb-2 dark:text-white"
      >
        Name
      </label>
      <input
        type="text"
        id="title"
        onChange={handleBoardNameChange}
        value={boardName}
        className="border-[1px] rounded-md border-gray2 placeholder:text-sm py-2 px-4 dark:bg-gray5 dark:border-gray4 dark:text-white"
        placeholder="e.g. Web Design"
      />

      <div className="flex flex-col gap-2 ">
        <p className="text-sm font-bold text-gray3 pt-6 dark:text-white">
          Columns
        </p>
        {columns.map((column, index) => (
          <div className="flex" key={column.id}>
            <input
              type="text"
              value={column.name}
              onChange={(e) => handleColumnNameChange(e, index)}
              className="border-[1px] rounded-md border-gray2 placeholder:text-sm py-2 px-4 w-full dark:bg-gray5 dark:border-gray4 dark:text-white"
              placeholder={`Column ${index + 1}`}
            />
            <Button
              className="ml-3"
              onClick={(e) => handleDeleteColumn(index, e)}
            >
              <XMarkIcon fill="#828FA3" className="size-6" />
            </Button>
          </div>
        ))}
        <p className="text-sm text-center text-red2">{error}</p>
      </div>

      <div className="w-full py-4">
        <ButtonSecondary className="w-full" onClick={handleCreateNewColumn}>
          + Add New Column
        </ButtonSecondary>
      </div>
      <div className="w-full pb-4">
        <ButtonPrimaryS className="w-full" onClick={handleCreateBoard}>
          Create New Board
        </ButtonPrimaryS>
      </div>
      <div className="w-full ">
        <ButtonDestructive
          className="w-full"
          onClick={handleCancelAndResetData}
        >
          Cancel
        </ButtonDestructive>
      </div>
    </form>
  );
};
