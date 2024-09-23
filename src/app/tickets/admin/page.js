import TicketListAdmin from '../../../components/TicketListAdmin';
import { auth } from '../../../auth';
import { redirect } from "next/navigation";
import Sidebar from '../../../components/Sidebar';

const AdminTicketPage = async () => {
  const session = await auth();

  if (session?.user?.role != "admin") {
    redirect('/home/');
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={session.user} currentPage="tickets" />

      <main className="flex-1 p-6 ml-64">
        <h1 className="text-2xl font-bold mb-4">Manage tickets</h1>
        <TicketListAdmin />
      </main>
    </div>
  );
};

export default AdminTicketPage;
