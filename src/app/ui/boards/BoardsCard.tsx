import { useKanbanTaskManagerContext } from '@/app/lib/contexts/KanbanTaskManagerContext';
import { auth } from '@/app/lib/firebase/config';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useAuthState } from 'react-firebase-hooks/auth';
import { TaskList } from '../utils/BoardInterfaces';
import { dataSave } from '../utils/utils';
import { BoardElement } from './BoardElement';

export const BoardsCard = () => {
  const { boardToRender, setBoardToRender, boards, setBoards } =
    useKanbanTaskManagerContext();
  const [user] = useAuthState(auth);

  const handleDragDrop = (results: DropResult) => {
    const { source, destination } = results;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (boardToRender) {
      if (results.type !== 'board') {
        const columns = boardToRender.columns;
        const columnSourceIndex = columns.findIndex(
          (column: TaskList) => column.id === source.droppableId
        );
        const columnDestinationIndex = columns.findIndex(
          (column: TaskList) => column.id === destination.droppableId
        );

        const newSourceTasks = [...columns[columnSourceIndex].tasks];

        const newDestinationTasks =
          source.droppableId !== destination.droppableId
            ? columns[columnDestinationIndex].tasks
              ? [...columns[columnDestinationIndex].tasks]
              : []
            : newSourceTasks;

        const [taskToMove] = newSourceTasks.splice(source.index, 1);
        newDestinationTasks.splice(destination.index, 0, taskToMove);

        const newColumns = [...columns];
        newColumns[columnSourceIndex] = {
          ...columns[columnSourceIndex],
          tasks: newSourceTasks,
        };
        newColumns[columnDestinationIndex] = {
          ...columns[columnDestinationIndex],
          tasks: newDestinationTasks,
        };

        const updatedBoard = {
          ...boardToRender,
          columns: newColumns,
        };

        const updatedBoards = boards.map((board) =>
          board.id === boardToRender.id ? updatedBoard : board
        );

        setBoardToRender(updatedBoard);
        setBoards(updatedBoards);
        if (user) {
          dataSave(user.uid, updatedBoards);
        }
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray1 dark:bg-gray6">
      <DragDropContext onDragEnd={handleDragDrop}>
        <BoardElement />
      </DragDropContext>
    </div>
  );
};
