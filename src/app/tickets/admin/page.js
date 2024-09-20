import TicketListAdmin from '../../../components/TicketListAdmin';

const AdminTicketPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage tickets</h1>
      <TicketListAdmin />
    </div>
  );
};

export default AdminTicketPage;
