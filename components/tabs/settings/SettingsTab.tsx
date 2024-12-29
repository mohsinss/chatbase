import { SettingsMenu } from "./SettingsMenu";

const SettingsTab = () => {
  return (
    <div className="flex gap-8">
      <SettingsMenu />
      <div className="flex-1 space-y-6">
        <h2 className="text-2xl font-bold">Settings</h2>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab; 