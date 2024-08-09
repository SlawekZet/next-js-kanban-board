import { handleExitModalClick } from '@/app/lib/actions';
import { useKanbanTaskManagerContext } from '@/app/lib/contexts/KanbanTaskManagerContext';
import { auth } from '@/app/lib/firebase/config';
import { XMarkIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { v4 as uuidv4 } from 'uuid';
import { Board, TaskList } from '../../utils/BoardInterfaces';
import { Button } from '../../utils/buttons/Button';
import { ButtonPrimaryS } from '../../utils/buttons/ButtonPrimaryS';
import { ButtonSecondary } from '../../utils/buttons/ButtonSecondary';
import { ButtonDestructive } from '../../utils/buttons/DestructiveButton';
import { saveToLocalStorage } from '../../utils/LocalStorage';
import { dataSave } from '../../utils/utils';

interface EditBoardFormProps {
  modalId: string;
}

export const EditBoardForm: React.FC<EditBoardFormProps> = ({ modalId }) => {
  const {
    boards,
    setBoards,
    setBoardToRender,
    boardToRender,
    error,
    setError,
  } = useKanbanTaskManagerContext();

  const [boardName, setBoardName] = useState(boardToRender?.name || '');
  const [columns, setColumns] = useState<TaskList[]>(
    boardToRender?.columns || []
  );
  const [user] = useAuthState(auth);

  useEffect(() => {
    setBoardName(boardToRender?.name || '');
    setColumns(boardToRender?.columns || []);
  }, [boardToRender]);

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
    setColumns(boardToRender ? boardToRender.columns : []);
    setBoardName(boardToRender ? boardToRender.name : '');
    setError('');
    handleExitModalClick(modalId);
  };

  const handleUpdateBoard = () => {
    if (boardToRender) {
      const updatedBoard = {
        ...boardToRender,
        columns: columns,
        name: boardName,
      };
      setBoardToRender(updatedBoard);
      const updatedBoards = boards.map((boardelem) => {
        return boardelem.id === boardToRender.id ? updatedBoard : boardelem;
      });

      setBoards(updatedBoards);
      user
        ? dataSave(user.uid, updatedBoards)
        : saveToLocalStorage({ key: 'boards', value: updatedBoards });
    }
  };

  return (
    <form className="flex flex-col" method="dialog">
      <h1 className="font-bold text-lg pb-6 dark:text-white">Edit Board</h1>
      <label
        htmlFor="title"
        className="text-sm font-bold text-gray3 pb-2 dark:text-white"
      >
        Name
      </label>
      <input
        type="text"
        id="title"
        className="border-[1px] rounded-md border-gray2 placeholder:text-sm py-2 px-4 dark:bg-gray5 dark:border-gray4 dark:text-white"
        value={boardName}
        onChange={handleBoardNameChange}
      />

      <div className="flex flex-col gap-2 ">
        <p className="text-sm font-bold text-gray3 pt-6 dark:text-white">
          Board Columns
        </p>
        {columns
          ? columns.map((column, index) => (
              <div className="flex" key={column.id}>
                <input
                  id={`column${index + 1}`}
                  type="text"
                  className="border-[1px] rounded-md border-gray2 placeholder:text-sm py-2 px-4 w-full dark:bg-gray5 dark:border-gray4 dark:text-white"
                  value={column.name}
                  placeholder={`Column ${index + 1}`}
                  onChange={(e) => handleColumnNameChange(e, index)}
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
      <div className="w-full py-4">
        <ButtonSecondary className="w-full" onClick={handleCreateNewColumn}>
          + Add New Column
        </ButtonSecondary>
      </div>
      <div className="w-full pb-4">
        <ButtonPrimaryS className="w-full" onClick={handleUpdateBoard}>
          Save Changes
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
