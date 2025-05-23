import React, { ReactNode, ReactElement } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import config from "@/config";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";
import ChatbotAISettings from "@/models/ChatbotAISettings";
import DashboardNav from "@/components/DashboardNav";
import ChatbotTabs from "@/components/chatbot/ChatbotTabs";
import Playground from "@/components/chatbot/playground/Playground";
// This is a server-side component to ensure the user is logged in.
// If not, it will redirect to the login page.
// It's applied to all subpages of /dashboard in /app/dashboard/*** pages
// You can also add custom static UI elements like a Navbar, Sidebar, Footer, etc..
// See https://chatsa.co/docs/tutorials/private-page
export default async function LayoutPrivate({
  params,
  children,
}: {
  params: { teamId: string; chatbotId: string },
  children: ReactNode | ReactElement<any>;
}) {
  await connectMongo();
  const team = await Team.findOne({ teamId: params.teamId });
  const chatbot = await Chatbot.findOne({ chatbotId: params.chatbotId });
  const aiSettings = await ChatbotAISettings.findOne({ chatbotId: params.chatbotId });

  if (!team || !chatbot) {
    redirect("/dashboard");
  }
  console.log(children)
  console.log('typeof children is ', typeof children)
  console.log('React.isValidElement(children)', React.isValidElement(children))
  // Pass team and chatbot as props to children if possible
  // Check if children is a valid React element and clone it with props
  if (React.isValidElement(children)) {
    return React.cloneElement(children as ReactElement<any>, { aaa:"aaa" });
  }
  return <>{children}</>;
}
