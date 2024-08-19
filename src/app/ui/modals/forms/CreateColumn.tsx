import { handleExitModalClick } from '@/app/lib/actions';
import { useKanbanTaskManagerContext } from '@/app/lib/contexts/KanbanTaskManagerContext';
import { auth } from '@/app/lib/firebase/config';
import { XMarkIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { v4 as uuidv4 } from 'uuid';
import { TaskList } from '../../utils/BoardInterfaces';
import { Button } from '../../utils/buttons/Button';
import { ButtonPrimaryS } from '../../utils/buttons/ButtonPrimaryS';
import { ButtonSecondary } from '../../utils/buttons/ButtonSecondary';
import { ButtonDestructive } from '../../utils/buttons/DestructiveButton';
import { dataSave } from '../../utils/utils';

interface CreateColumnFormProps {
  modalId: string;
}

export const CreateColumnForm: React.FC<CreateColumnFormProps> = ({
  modalId,
}) => {
  const {
    boardToRender,
    boards,
    setBoards,
    setBoardToRender,
    error,
    setError,
  } = useKanbanTaskManagerContext();

  const [columns, setColumns] = useState<TaskList[]>([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (boardToRender) {
      setColumns(boardToRender?.columns);
    }
  }, [boardToRender]);

  const handleCreateNewColumn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (columns.length < 20) {
      setColumns([...columns, { id: uuidv4(), name: '', tasks: [] }]);
      setError('');
    } else {
      setError('Maximum number of columns (20) reached');
    }
  };

  const handleColumnNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newColumns = columns.slice();
    newColumns[index].name = e.target.value;
    setColumns(newColumns);
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

  const handleSaveButton = () => {
    if (boardToRender) {
      const updatedBoard = {
        ...boardToRender,
        columns: [...columns],
      };
      setBoardToRender(updatedBoard);

      const updatedBoards = boards.map((board) => {
        return board.id === boardToRender.id ? updatedBoard : board;
      });
      setBoards(updatedBoards);

      if (user) {
        dataSave(user.uid, updatedBoards);
      }
    }
  };

  const handleCancelAndResetData = () => {
    if (boardToRender) {
      setColumns(boardToRender?.columns);
      setError('');
    }
    handleExitModalClick(modalId);
  };

  return (
    <form className="flex flex-col" method="dialog">
      <h1 className="font-bold text-lg pb-6 dark:text-white">Add New Column</h1>

      <div className="flex flex-col gap-2 ">
        <label
          htmlFor="subtask"
          className="text-sm font-bold text-gray3 pt-6 dark:text-white"
        >
          Columns
        </label>
        {columns
          ? columns.map((column, index) => (
              <div className="flex" key={column.id}>
                <input
                  type="text"
                  id={column.id}
                  className="border-[1px] rounded-md border-gray2 placeholder:text-sm py-2 px-4 w-full dark:bg-gray5 dark:border-gray4 dark:text-white"
                  value={column.name}
                  onChange={(e) => handleColumnNameChange(e, index)}
                  placeholder={`Column ${index + 1}`}
                />
                <Button
                  className="ml-3"
                  onClick={(e) => handleDeleteColumn(index, e)}
                >
                  <XMarkIcon fill="#828FA3" className="size-6" />
                </Button>
              </div>
            ))
          : null}
        <p className="text-sm text-center text-red2">{error}</p>
      </div>
      <div className="py-4">
        <ButtonSecondary className="w-full" onClick={handleCreateNewColumn}>
          + Add New Column
        </ButtonSecondary>
      </div>
      <div className="pb-4">
        <ButtonPrimaryS className="w-full" onClick={handleSaveButton}>
          Save
        </ButtonPrimaryS>
      </div>
      <div>
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
