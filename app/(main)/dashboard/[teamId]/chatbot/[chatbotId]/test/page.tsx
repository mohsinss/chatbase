'use client'

import React from "react";

interface TestPageProps {
  team: any;
  chatbot: any;
  aaa: any;
}

export default function TestPage(props: any) {
  console.log('props', props)
  return (
    <div>
      <h1>Test Page</h1>
      <h2>Team Info</h2>
      {/* <pre>{JSON.stringify(team, null, 2)}</pre> */}
      <h2>Chatbot Info</h2>
      {/* <pre>{JSON.stringify(chatbot, null, 2)}</pre> */}
    </div>
  );
}
