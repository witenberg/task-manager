// TicketListAdmin.jsx
import { useEffect, useState } from 'react';

const TicketListAdmin = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        async function fetchTickets() {
            const response = await fetch('/api/tickets');
            const data = await response.json();
            setTickets(data);
        }

        fetchTickets();
    }, []);

    const updateTicketStatus = async (ticketId, newStatus) => {
        await fetch(`/api/tickets/${ticketId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
        });
    };

    return (
        <div>
            <h2>Manage Tickets</h2>
            <ul>
                {tickets.map(ticket => (
                    <li key={ticket._id}>
                        <h3>{ticket.title}</h3>
                        <p>{ticket.description}</p>
                        <p>Status: {ticket.status}</p>
                        <button onClick={() => updateTicketStatus(ticket._id, 'in-progress')}>In Progress</button>
                        <button onClick={() => updateTicketStatus(ticket._id, 'closed')}>Close</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TicketListAdmin;
