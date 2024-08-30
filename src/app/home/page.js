import { auth } from "../../auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Logout from "../../components/Logout";

const HomePage = async () => {
  const session = await auth();

  if (!session?.user) redirect("/");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col items-center py-6">
        {
           session?.user?.image && session?.user?.name? (
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
                {session?.user?.email}</h1>
           )
        }
        
        <Logout />
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700">
            Dashboard
          </h2>
          <p className="text-gray-600">
            Welcome to your task management app. Start by adding your first task!
          </p>
        </header>

        {/* Placeholder for future application content */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Your Tasks
          </h3>
          <p className="text-gray-600">
            This is where your tasks will appear. Use the menu on the left to navigate.
          </p>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
