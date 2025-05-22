"use client";

import { useState } from "react";
import ConfigPanel from "./ConfigPanel";

const ChatbotCreator = ({ teamId }: { teamId: string }) => {
  return (
    <div>
      <div className="mb-8 px-8 pt-8">
      </div>
      
      <div className="flex">
        <ConfigPanel teamId={teamId} />
      </div>
    </div>
  );
};

export default ChatbotCreator; 