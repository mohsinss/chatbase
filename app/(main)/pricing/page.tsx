import PricingSection from "@/components/PricingSection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { getTeams } from "@/libs/teams";

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  let is_signed: boolean = true;
  let teams: any = null;
  if (!session?.user) {
    is_signed = false;
  } else {
    teams = await getTeams(session.user.id);
  }

  return <PricingSection is_signed={is_signed} team={teams ? teams[0] : null}/>;
} 