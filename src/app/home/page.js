import { auth } from "../../auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Logout from "../../components/Logout";
import TaskList from "../../components/TaskList";

const HomePage = async () => {
  const session = await auth();

  if (!session?.user) redirect("/");

  console.log("USER ID:", session.user.id);
  console.log("USER ROLE:", session.user.role);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col items-center py-6 fixed top-0 left-0 h-screen">
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

        <div className="mt-auto">
        {session?.user?.role == 'admin' ?
          <form method="POST" action="/tickets/admin">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Manage tickets
            </button>
          </form>
          :
          <form method="POST" action="/tickets/user">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Report a problem
            </button>
          </form>
        }
        </div>

      </aside>

      <main className="flex-1 p-6 ml-64">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700">Dashboard</h2>
          <p className="text-gray-600">
            Welcome to your task management app.
          </p>
        </header>

        <TaskList userId={session.user.id}/>

      </main>
    </div>
  );
};

export default HomePage;
