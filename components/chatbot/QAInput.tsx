const QAInput = () => {
  return (
    <div className="flex-1 p-6">
      <div className="border-2 border-dashed rounded-lg p-8">
        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-4 rounded-md bg-base-200"
            placeholder="Question..."
          />
          <textarea
            className="w-full h-32 p-4 rounded-md bg-base-200"
            placeholder="Answer..."
          />
        </div>
      </div>
    </div>
  );
};

export default QAInput; 