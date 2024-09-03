import { handleExitModalClick } from '@/app/lib/actions';
import { useKanbanTaskManagerContext } from '@/app/lib/contexts/KanbanTaskManagerContext';
import { auth } from '@/app/lib/firebase/config';
import { XMarkIcon } from '@heroicons/react/20/solid';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { v4 as uuidv4 } from 'uuid';
import { Subtask, Task, TaskList } from '../../utils/BoardInterfaces';
import { Button } from '../../utils/buttons/Button';
import { ButtonPrimaryS } from '../../utils/buttons/ButtonPrimaryS';
import { ButtonSecondary } from '../../utils/buttons/ButtonSecondary';
import { ButtonDestructive } from '../../utils/buttons/DestructiveButton';
import { dataSave } from '../../utils/utils';

interface CreateTaskFormProps {
  modalId: string;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ modalId }) => {
  const {
    boardToRender,
    setBoardToRender,
    boards,
    setBoards,
    error,
    setError,
  } = useKanbanTaskManagerContext();
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<TaskList | null>(null);
  const [user] = useAuthState(auth);

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };

  const handleDescNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
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

  const handleColumnsSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedColumnId = event.target.value;
    const selColumn = boardToRender?.columns.find(
      (column) => column.id === selectedColumnId
    );
    if (selColumn) {
      setSelectedColumn(selColumn);
    }
  };

  const handleCancelAndResetData = () => {
    resetForm();
    handleExitModalClick(modalId);
  };

  const handleCreateTask = () => {
    if (!selectedColumn || !boardToRender) return;

    const newTask: Task = {
      id: uuidv4(),
      title: taskName,
      description: description,
      status: selectedColumn.name,
      subtasks: subtasks,
    };

    const updatedColumns = boardToRender.columns.map((column) =>
      column.id === selectedColumn.id
        ? {
            ...column,
            tasks: column.tasks ? [...column.tasks, newTask] : [newTask],
          }
        : column
    );

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

  const resetForm = () => {
    setSubtasks([]);
    setTaskName('');
    setSelectedColumn(null);
    setDescription('');
    setError('');
  };

  return (
    <form className="flex flex-col" method="dialog">
      <h1 className="font-bold text-lg pb-6 dark:text-white">Add New Task</h1>
      <label
        htmlFor="title"
        className="text-sm font-bold text-gray3 pb-2 dark:text-white"
      >
        Title
      </label>
      <input
        type="text"
        id="title"
        className="border-[1px] rounded-md border-gray2 placeholder:text-sm mob:text-sm py-2 px-4 dark:bg-gray5 dark:border-gray4 dark:text-white"
        placeholder="e.g. Take coffee break"
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
        className="border-[1px] rounded-md border-gray2 mob:text-sm placeholder:text-sm py-2 px-4 dark:text-white dark:bg-gray5 dark:border-gray4"
        placeholder="e.g. It’s always good to take a break. This 15 minute break will 
        recharge the batteries a little."
        value={description}
        onChange={(e) => handleDescNameChange(e)}
      ></textarea>
      <div className="flex flex-col gap-2 ">
        <p className="text-sm font-bold text-gray3 pt-6 dark:text-white">
          Subtasks
        </p>
        {subtasks.map((subtask, index) => (
          <div className="flex" key={subtask.id}>
            <input
              type="text"
              id="subtask1"
              className="border-[1px] rounded-md border-gray2 mob:text-sm placeholder:text-sm py-2 px-4 w-full dark:bg-gray5 dark:border-gray4 dark:text-white"
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
        <p className="text-sm text-center text-red2">{error}</p>
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
          value={selectedColumn?.id || ''}
          onChange={handleColumnsSelect}
          id="columns"
          className="border-[1px] rounded-md border-gray2 placeholder:text-sm py-2 px-2 w-full text-sm dark:bg-gray5 dark:border-gray4 dark:text-white"
        >
          <option value="" disabled>
            Select an option
          </option>
          {boardToRender?.columns
            ? boardToRender.columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.name}
                </option>
              ))
            : null}
        </select>
      </div>
      <div className="w-full py-4">
        <ButtonPrimaryS className="w-full" onClick={handleCreateTask}>
          Create Task
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

export default CreateTaskForm;
