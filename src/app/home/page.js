import { auth } from "../../auth";
import { redirect } from "next/navigation";
import TaskList from "../../components/TaskList";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const HomePage = async () => {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={session.user} currentPage="home" />

      <main className="flex-1 p-6 ml-64">
        <Header title="Dashboard" description="Welcome to your task management app." />
        <TaskList userId={session.user.id} />
      </main>

    </div>
  );
};

export default HomePage;
