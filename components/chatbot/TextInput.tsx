const TextInput = () => {
  return (
    <div className="flex-1 p-6">
      <div className="border-2 border-dashed rounded-lg p-8">
        <textarea 
          className="w-full h-48 p-4 rounded-md bg-base-200" 
          placeholder="Enter your text here..."
        />
      </div>
    </div>
  );
};

export default TextInput; 