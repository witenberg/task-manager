import { auth } from "../../auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Logout from "../../components/Logout";
import TaskList from "../../components/TaskList";

const HomePage = async () => {
  const session = await auth();

  if (!session?.user) redirect("/");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col items-center py-6">
        {session?.user?.image && session?.user?.name ? (
          <>
            <Image
              src={session?.user?.image}
              alt={session?.user?.name}
              width={80}
              height={80}
              className="rounded-full mb-4"
            />
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              {session?.user?.name}
            </h1>
          </>
        ) : (
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            {session?.user?.email}
          </h1>
        )}

        <Logout />
      </aside>

      <main className="flex-1 p-6">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700">Dashboard</h2>
          <p className="text-gray-600">
            Welcome to your task management app.
          </p>
        </header>

        <TaskList />
      </main>
    </div>
  );
};

export default HomePage;
