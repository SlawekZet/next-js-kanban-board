import { useKanbanTaskManagerContext } from '@/app/lib/contexts/KanbanTaskManagerContext';
import { auth } from '@/app/lib/firebase/config';
import { XMarkIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { v4 as uuidv4 } from 'uuid';
import { Subtask, Task, TaskList } from '../../utils/BoardInterfaces';
import { Button } from '../../utils/buttons/Button';
import { ButtonPrimaryS } from '../../utils/buttons/ButtonPrimaryS';
import { ButtonSecondary } from '../../utils/buttons/ButtonSecondary';
import { ButtonDestructive } from '../../utils/buttons/DestructiveButton';
import { dataSave } from '../../utils/utils';

interface EditTaskFormProps {
  modalId: string;
  task: Task;
  column: string;
  columnId: string;
}

export const EditTaskForm: React.FC<EditTaskFormProps> = ({
  modalId,
  task,
  column,
  columnId,
}) => {
  const {
    boardToRender,
    setIsElementEdited,
    setBoardToRender,
    boards,
    setBoards,
    error,
    setError,
  } = useKanbanTaskManagerContext();

  const [taskName, setTaskName] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks);
  const [selectedColumn, setSelectedColumn] = useState<TaskList | null>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const currentColumn = boardToRender?.columns.find((column) =>
      column.tasks.some((t) => t.id === task.id)
    );

    setSelectedColumn(currentColumn ?? null);
  }, [boardToRender, task.id]);

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };

  const handleDescNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleColumnsSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedColumnId = event.target.value;

    const selColumn = boardToRender?.columns.find(
      (column) => column.id === selectedColumnId
    );
    if (selColumn) {
      setSelectedColumn(selColumn);
    }
  };

  const handleSubtaskNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newSubtasks = subtasks.slice();
    newSubtasks[index].title = e.target.value;
    setSubtasks(newSubtasks);
  };

  const handleCreateNewSubtask = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (subtasks.length < 20) {
      setSubtasks([
        ...subtasks,
        { id: uuidv4(), title: '', isCompleted: false },
      ]);
      setError('');
    } else {
      setError('Maximum number of columns (20) reached');
    }
  };

  const handleDeleteSubtask = (
    index: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const updatedSubtasks = subtasks.slice();
    updatedSubtasks.splice(index, 1);
    setSubtasks(updatedSubtasks);
    setError('');
  };

  const handleUpdateTask = () => {
    if (!selectedColumn || !boardToRender) return;

    const updatedTask: Task = {
      id: task.id,
      title: taskName,
      description: description,
      status: selectedColumn.name,
      subtasks: subtasks,
    };

    // Find the original column
    const originalColumn = boardToRender.columns.find((column) =>
      column.tasks.some((t) => t.id === task.id)
    );

    let updatedColumns;

    if (originalColumn && originalColumn.id !== selectedColumn.id) {
      // If the column has changed, remove the task from the original column
      const originalColumnTasks = originalColumn.tasks.filter(
        (t) => t.id !== task.id
      );

      // Add the task to the selected column
      const selectedColumnTasks = selectedColumn.tasks
        ? [...selectedColumn.tasks, updatedTask]
        : [updatedTask];

      updatedColumns = boardToRender.columns.map((column) => {
        if (column.id === originalColumn.id) {
          return { ...column, tasks: originalColumnTasks };
        } else if (column.id === selectedColumn.id) {
          return { ...column, tasks: selectedColumnTasks };
        } else {
          return column;
        }
      });
    } else {
      // If the column hasn't changed, just update the task within the same column
      const updatedTasks = selectedColumn.tasks.map((t) =>
        t.id === task.id ? updatedTask : t
      );

      updatedColumns = boardToRender.columns.map((column) =>
        column.id === selectedColumn.id
          ? { ...column, tasks: updatedTasks }
          : column
      );
    }

    const updatedBoard = {
      ...boardToRender,
      columns: updatedColumns,
    };

    const updatedBoards = boards.map((board) =>
      board.id === boardToRender.id ? updatedBoard : board
    );

    setBoardToRender(updatedBoard);
    setBoards(updatedBoards);
    if (user) {
      dataSave(user.uid, updatedBoards);
    }
    resetForm();
  };

  const handleCancelAndResetData = () => {
    resetForm();
    handleExitModalClick(modalId);
  };

  const handleExitModalClick = (modalId: string) => {
    const modal = document.querySelector<HTMLDialogElement>(`#${modalId}`);
    if (modal) {
      modal.close();
    }
    setIsElementEdited(false);
  };

  const resetForm = () => {
    setSubtasks([]);
    setTaskName('');
    setSelectedColumn(null);
    setDescription('');
    setError('');
    setIsElementEdited(false);
  };

  return (
    <form className="flex flex-col" method="dialog">
      <h1 className="font-bold text-lg mob:text-m pb-6 dark:text-white">
        Edit Task
      </h1>
      <label
        htmlFor="title"
        className="text-sm font-bold text-gray3 pb-2 dark:text-white"
      >
        Title
      </label>
      <input
        type="text"
        id="title"
        className="border-[1px] rounded-md mob:text-sm border-gray2 py-2 px-4 dark:bg-gray5 dark:border-gray4 dark:text-white"
        value={taskName}
        onChange={(e) => handleTaskNameChange(e)}
      />
      <label
        htmlFor="desc"
        className="text-sm font-bold text-gray3 pb-2 pt-6 dark:text-white"
      >
        Description
      </label>
      <textarea
        id="desc"
        className="border-[1px] rounded-md border-gray2 placeholder:text-sm py-2 px-4 dark:text-white dark:bg-gray5 dark:border-gray4 text-sm"
        placeholder={
          description
            ? ''
            : 'e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little.'
        }
        defaultValue={description ? description : ''}
        onChange={(e) => handleDescNameChange(e)}
      ></textarea>
      <div className="flex flex-col gap-2 ">
        <p className="text-sm font-bold text-gray3 pt-6 dark:text-white">
          Subtasks
        </p>
        {subtasks.map((subtask, index) => (
          <div className="flex" key={index}>
            <input
              type="text"
              id="subtask1"
              className="border-[1px] rounded-md border-gray2 mob:text-sm placeholder:text-sm py-2 px-4 w-full dark:bg-gray5 dark:border-gray4 dark:text-white"
              value={subtask.title}
              placeholder={`Subtask ${index + 1}`}
              onChange={(e) => handleSubtaskNameChange(e, index)}
            />
            <Button
              className="ml-3"
              onClick={(e) => handleDeleteSubtask(index, e)}
            >
              <XMarkIcon fill="#828FA3" className="size-6" />
            </Button>
          </div>
        ))}
      </div>
      <div className="w-full py-4">
        <ButtonSecondary
          className="w-full"
          onClick={(e) => handleCreateNewSubtask(e)}
        >
          + Add New Subtask
        </ButtonSecondary>
      </div>
      <div className="flex flex-col pb-2">
        <label
          htmlFor="status"
          className="text-sm font-bold text-gray3 pb-2 pt-2 dark:text-white"
        >
          Status / Column
        </label>
        <select
          // defaultValue={columnId}
          value={selectedColumn?.id || columnId}
          onChange={handleColumnsSelect}
          id="columns"
          className="border-[1px] rounded-md border-gray2 placeholder:text-sm py-2 px-2 w-full text-sm dark:bg-gray5 dark:border-gray4 dark:text-white"
        >
          {boardToRender
            ? boardToRender.columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.name}
                </option>
              ))
            : null}
        </select>
      </div>
      <div className="w-full py-4">
        <ButtonPrimaryS className="w-full" onClick={handleUpdateTask}>
          Update Task
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
