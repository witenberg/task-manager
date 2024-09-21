import TicketListAdmin from '../../../components/TicketListAdmin';
import { auth } from '../../../auth';
import { redirect } from "next/navigation";

const AdminTicketPage = async() => {
  const session = await auth();

  if (session?.user?.role != "admin") {
    redirect('/home/');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage tickets</h1>
      <TicketListAdmin />
    </div>
  );
};

export default AdminTicketPage;
