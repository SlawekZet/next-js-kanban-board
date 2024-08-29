import { Droppable } from 'react-beautiful-dnd';
import { TaskElement } from './Task';
import { Task } from '../utils/BoardInterfaces';

interface TaskListProps {
  columnId: string;
  name: string;
  tasks: Task[];
  boardId: string;
}

export const TaskList = ({ name, tasks, columnId, boardId }: TaskListProps) => {
  return (
    <Droppable droppableId={columnId} type="TaskList">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-col w-[300px] min-w-[300px]"
        >
          <div className="uppercase text-gray3 tracking-[3px] font-bold">
            <div className="flex flex-row items-center pb-6 gap-4 pl-1 text-wrap">
              <div className="w-5 h-5 rounded-full bg-violet2 flex-shrink-0"></div>
              <h2>
                {name} ({tasks ? tasks.length : '0'})
              </h2>
            </div>
          </div>
          <div
            id="tasksContainer"
            className="flex flex-col gap-4 h-full overflow-auto pl-1 pr-2 pt-1 pb-2"
          >
            {tasks
              ? tasks.map((e, index) => (
                  <TaskElement
                    task={e}
                    index={index}
                    id={e.id}
                    key={e.id}
                    name={name}
                    boardId={boardId}
                    columnId={columnId}
                  />
                ))
              : null}
          </div>
          {/* {provided.placeholder} */}
        </div>
      )}
    </Droppable>
  );
};
