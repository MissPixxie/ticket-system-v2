type dataProps = {
  data: boolean;
};
export function Toast({ data }: dataProps) {
  return (
    <div className="fixed top-75 z-30">
      {data ? (
        <div className="popUpMessage mb-4 rounded bg-green-500/20 p-3 text-red-200">
          <h3>Ticket submitted</h3>
        </div>
      ) : (
        <div className="popUpMessage mb-4 rounded bg-red-500/20 p-3 text-red-200">
          <h3>Something went wrong...</h3>
        </div>
      )}
      <h3></h3>
    </div>
  );
}
