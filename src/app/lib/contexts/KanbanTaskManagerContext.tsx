'use client';
import { Board } from '@/app/ui/utils/BoardInterfaces';
import { createContext, useContext, useState } from 'react';
// import data from '@/app/lib/data.json';

interface KanbanTaskManagerContextProps {
  boardToRender: Board | null;
  setBoardToRender: React.Dispatch<React.SetStateAction<Board | null>>;
  boards: Board[];
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
  isDarkTheme: boolean;
  setIsDarkTheme: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarHidden: boolean;
  setIsSidebarHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isElementEdited: boolean;
  setIsElementEdited: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteModalVisible: boolean;
  setIsDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuVisible: boolean;
  setIsMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isBoardMenuVisible: boolean;
  setIsBoardMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  activeBoard: number;
  setActiveBoard: React.Dispatch<React.SetStateAction<number>>;
  isCreateBoardModalVisible: boolean;
  setIsCreateBoardModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface KanbanTaskManagerProviderProps {
  children: React.ReactNode;
}

const KanbanTaskManagerContext = createContext<
  KanbanTaskManagerContextProps | undefined
>(undefined);

export const KanbanTaskManagerProvider: React.FC<
  KanbanTaskManagerProviderProps
> = ({ children }) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [boardToRender, setBoardToRender] = useState<Board | null>(boards[0]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState<boolean>(false);
  const [isElementEdited, setIsElementEdited] = useState<boolean>(false);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [isBoardMenuVisible, setIsBoardMenuVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [isCreateBoardModalVisible, setIsCreateBoardModalVisible] =
    useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeBoard, setActiveBoard] = useState<number>(0);

  const value: KanbanTaskManagerContextProps = {
    boardToRender,
    setBoardToRender,
    boards,
    setBoards,
    isDarkTheme,
    setIsDarkTheme,
    isSidebarHidden,
    setIsSidebarHidden,
    isElementEdited,
    setIsElementEdited,
    isMenuVisible,
    setIsMenuVisible,
    isDeleteModalVisible,
    setIsDeleteModalVisible,
    isBoardMenuVisible,
    setIsBoardMenuVisible,
    error,
    setError,
    activeBoard,
    setActiveBoard,
    isCreateBoardModalVisible,
    setIsCreateBoardModalVisible,
  };

  return (
    <KanbanTaskManagerContext.Provider value={value}>
      {children}
    </KanbanTaskManagerContext.Provider>
  );
};

export const useKanbanTaskManagerContext = () => {
  const context = useContext(KanbanTaskManagerContext);
  if (context === undefined) {
    throw new Error(
      'useKanbanTaskManagerContext must be used within a KanbanTaskManagerProvider'
    );
  }
  return context;
};
