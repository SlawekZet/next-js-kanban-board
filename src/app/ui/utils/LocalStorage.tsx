import { Board } from '@/app/ui/utils/BoardInterfaces';

interface SaveToLocalStorageProps {
  key: string;
  value: Board[];
}

export const saveToLocalStorage = ({
  key,
  value,
}: SaveToLocalStorageProps): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getFromLocalStorage = (key: string): Board[] | null => {
  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem(key);
    return storedValue ? (JSON.parse(storedValue) as Board[]) : null;
  }
  return null;
};
