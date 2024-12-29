const GeneralSettings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">General Settings</h2>
      <div className="card bg-base-200">
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Team Name</span>
            </label>
            <input 
              type="text" 
              className="input input-bordered w-full max-w-xs" 
              placeholder="Enter team name"
            />
          </div>
          
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text font-medium">Team Description</span>
            </label>
            <textarea 
              className="textarea textarea-bordered w-full max-w-md" 
              placeholder="Enter team description"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings; 