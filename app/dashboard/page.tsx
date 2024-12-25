import ButtonAccount from "@/components/ButtonAccount";
import ButtonCreateTeam from "@/components/ButtonCreateTeam";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <ButtonAccount />
          <ButtonCreateTeam />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold">
          Welcome to Dashboard
        </h1>
        {/* Add any other dashboard content here */}
      </section>
    </main>
  );
}
