import { auth } from '../../../auth';
import TicketForm from '../../../components/TicketForm';
import { redirect } from "next/navigation";

const UserTicketPage = async () => {
  const session = await auth();

  console.log(session.user.id);

  if (!session?.user) {
    redirect('/');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add ticket</h1>
      <TicketForm userId={session.user.id} />
    </div>
  );
};

export default UserTicketPage;
