"use client"

import { useEffect, useState } from "react";

const TicketList = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        async function fetchTickets() {
            const response = await fetch("/api/tickets");
            const data = await response.json();
            setTickets(data);
        }
        fetchTickets();
    }, []);

    return (
        <div>
            {tickets.map(ticket => (
                <div key={ticket._id}>
                    <h3>{ticket.title}</h3>
                    <p>{ticket.description}</p>
                    <p>Status: {ticket.status}</p>
                    <p>Priority: {ticket.priority}</p>
                </div>
            ))}
        </div>
    );
};

export default TicketList;
