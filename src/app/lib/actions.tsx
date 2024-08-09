export const handleExitModalClick = (modalId: string) => {
  const modal = document.querySelector<HTMLDialogElement>(`#${modalId}`);
  if (modal) {
    modal.close();
  }
};
