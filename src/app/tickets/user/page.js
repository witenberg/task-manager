import { auth } from '../../../auth';
import TicketForm from '../../../components/TicketForm';
import { redirect } from "next/navigation";
import Sidebar from '../../../components/Sidebar';
import TicketListUser from '../../../components/TicketListUser';

const UserTicketPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={session.user} currentPage="tickets" />

      <main className="flex-1 p-6 ml-64">
        <h1 className="text-2xl font-bold mb-4">Your tickets</h1>
        <TicketListUser userId={session.user.id} />
      </main>
    </div>
  );
};

export default UserTicketPage;
