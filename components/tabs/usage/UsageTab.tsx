const UsageTab = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Usage Statistics</h2>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Total Messages</div>
          <div className="stat-value">31K</div>
          <div className="stat-desc">Jan 1st - Feb 1st</div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Active Users</div>
          <div className="stat-value">4,200</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </div>
      </div>
    </div>
  );
};

export default UsageTab; 