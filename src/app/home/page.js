import { auth } from "../../auth";
import { redirect } from "next/navigation";
import TaskList from "../../components/TaskList";
import Sidebar from "../../components/Sidebar";

const HomePage = async () => {
  const session = await auth();

  if (!session?.user) redirect("/");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={session.user} currentPage="home" />

      <main className="flex-1 p-6 ml-64">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700">Dashboard</h2>
          <p className="text-gray-600">
            Welcome to your task management app.
          </p>
        </header>

        <TaskList userId={session.user.id} />
      </main>
    </div>
  );
};

export default HomePage;
