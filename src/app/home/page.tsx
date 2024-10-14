import { auth } from "../../auth";
import { redirect } from "next/navigation";
import TaskList from "../../components/TaskList";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const HomePage = async () => {
  const session = await auth()
  if (!session?.user) redirect("/")

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <Sidebar user={session.user} currentPage="home" />

      <main className="flex-1 p-8 ml-64">
        <div className="max-w-4xl mx-auto">
          {/* <Header 
            title="Dashboard" 
            description="Welcome to your task management app." 
          /> */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <TaskList userId={session.user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage