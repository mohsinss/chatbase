const WebsiteInput = () => {
  return (
    <div className="flex-1 p-6">
      <div className="border-2 border-dashed rounded-lg p-8">
        <input 
          type="url" 
          className="w-full p-4 rounded-md bg-base-200"
          placeholder="Enter website URL..."
        />
      </div>
    </div>
  );
};

export default WebsiteInput; 