"use client";

import { useEffect, useState } from 'react';

const TicketListAdmin = () => {
    const [tickets, setTickets] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all"); // Filtrowanie (all, open, in-progress, closed)
    const [sortBy, setSortBy] = useState("creationDate"); // Sortowanie (creationDate)

    useEffect(() => {
        async function fetchTickets() {
            const response = await fetch('/api/ticket');
            const data = await response.json();
            setTickets(data);
        }

        fetchTickets();
    }, []);

    const filteredAndSortedTickets = tickets
        .filter(ticket => {
            if (filterStatus === "open") return ticket.status === "open";
            if (filterStatus === "in-progress") return ticket.status === "in-progress";
            if (filterStatus === "closed") return ticket.status === "closed";
            return true; // "all"
        })
        .sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

    const updateTicketStatus = async (ticketId, newStatus) => {
        const response = await fetch('/api/ticket', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ticketId, status: newStatus }),
        });

        if (response.ok) {
            setTickets(tickets.map(ticket => 
                ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
            ));
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Tickets</h2>

            {/* Filter and Sort Options */}
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <label className="mr-2">Filter:</label>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border border-gray-300 rounded-md">
                            <option value="all">All</option>
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                    <div>
                        <label className="mr-2">Sort by:</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border border-gray-300 rounded-md">
                            <option value="creationDate">Creation Date</option>
                        </select>
                    </div>
                </div>
            </div>

            <ul className="space-y-4">
                {filteredAndSortedTickets.map(ticket => (
                    <li key={ticket._id} className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">{ticket.title}</h3>
                        <p className="text-gray-600 mb-4">{ticket.description}</p>

                        {/* Wyświetlanie kategorii */}
                        <p className="text-sm text-gray-500 mb-4">Category: {ticket.category}</p>

                        {/* Wyświetlanie statusu */}
                        <p className="text-sm text-gray-500 mb-4">
                            Status: <span className={`font-semibold ${ticket.status === 'closed' ? 'text-red-500' : 'text-blue-500'}`}>{ticket.status}</span>
                        </p>

                        {/* Wyświetlanie daty utworzenia */}
                        <p className="text-sm text-gray-500 mb-4">Created At: {new Date(ticket.createdAt).toLocaleString()}</p>

                        {/* Wyświetlanie zadania powiązanego z ticketem (jeśli istnieje) */}
                        {ticket.taskId && (
                            <p className="text-sm text-gray-500 mb-4">Related Task ID: {ticket.taskId}</p>
                        )}

                        {/* Wyświetlanie zdjęcia */}
                        {ticket.imageUrl && (
                            <div className="mb-4">
                                <img src={ticket.imageUrl} alt="Ticket screenshot" className="w-full h-auto max-w-xs object-cover rounded-md shadow-md" />
                            </div>
                        )}

                        <div className="flex space-x-4">
                            <button
                                onClick={() => updateTicketStatus(ticket._id, 'in-progress')}
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                            >
                                In Progress
                            </button>
                            <button
                                onClick={() => updateTicketStatus(ticket._id, 'closed')}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            >
                                Close
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TicketListAdmin;
