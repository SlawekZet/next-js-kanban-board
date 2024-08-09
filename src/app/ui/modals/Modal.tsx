/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect } from 'react';
import { useKanbanTaskManagerContext } from '@/app/lib/contexts/KanbanTaskManagerContext';

interface ModalProps {
  children: ReactNode;
  id: string;
}

export const Modal: React.FC<ModalProps> = ({ children, id }) => {
  const { setIsElementEdited, setIsMenuVisible, setIsDeleteModalVisible } =
    useKanbanTaskManagerContext();
  useEffect(() => {
    const modal = document.querySelector<HTMLDialogElement>(`#${id}`);
    const handleClickOutside = (e: MouseEvent) => {
      if (modal) {
        const dialogDimensions = modal.getBoundingClientRect();

        // TODO: For some reason dialog is getting 0 at all dimmensions editTask modal. To check later
        if (
          (e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom) &&
          dialogDimensions.top > 0
        ) {
          modal.close();
          setIsElementEdited(false);
          setIsMenuVisible(false);
          setIsDeleteModalVisible(false);
          // console.log('click outside the modal', id, modal);
        }
      }
    };

    if (modal) {
      modal.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (modal) {
        modal.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [id]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        console.log('Escape key pressed!');
        setIsElementEdited(false);
        setIsMenuVisible(false);
        setIsDeleteModalVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <dialog
      id={id}
      className="self-center justify-self-center rounded-lg w-[480px] p-8 backdrop:bg-gray6 backdrop:opacity-70 dark:bg-gray5 "
    >
      {children}
    </dialog>
  );
};
