export const Loading = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col w-[250px] bg-gray1 dark:bg-gray4 items-center text-center gap-4 p-8 rounded-xl shadow-lg">
          <p>Fetching data...</p>
        </div>
      </div>
    </>
  );
};
