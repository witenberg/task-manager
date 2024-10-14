import { auth } from '../../../auth';
import { redirect } from "next/navigation";
import Sidebar from '../../../components/Sidebar';
import TicketListUser from '../../../components/TicketListUser';

const UserTicketPage = async () => {
  const session = await auth()

  if (!session?.user) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <Sidebar user={session.user} currentPage="tickets" />

      <main className="flex-1 p-8 ml-64">
        <div className="max-w-4xl mx-auto">
          {/* <Header 
            title="Your Tickets" 
            description="Manage and track your support requests." 
          /> */}
          <div className="mt-8">
            <TicketListUser userId={session.user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserTicketPage
