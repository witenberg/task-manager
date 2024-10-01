"use client";

import { useEffect, useState } from 'react';

const TicketListAdmin = ({ adminId }) => { // Odbieranie adminId jako props
    const [tickets, setTickets] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("creationDate");
    const [activeTab, setActiveTab] = useState('unassigned'); // Nowa zmienna stanu dla aktywnej zakładki

    useEffect(() => {
        async function fetchTicketsAndAdmins() {
            const [ticketResponse, adminResponse] = await Promise.all([
                fetch('/api/ticket'),
                fetch('/api/admins'),
            ]);

            const ticketsData = await ticketResponse.json();
            const adminsData = await adminResponse.json();

            setTickets(ticketsData);
            setAdmins(adminsData);
        }

        fetchTicketsAndAdmins();
    }, []);

    const filteredAndSortedTickets = tickets
        .filter(ticket => {
            if (filterStatus === "open") return ticket.status === "open";
            if (filterStatus === "in-progress") return ticket.status === "in-progress";
            if (filterStatus === "closed") return ticket.status === "closed";
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "creationDate") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
            if (sortBy === "priority") {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return 0;
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

    const assignTicketToAdmin = async (ticketId, adminId) => {
        const response = await fetch('/api/ticket', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ticketId, assignedTo: adminId }),
        });

        if (response.ok) {
            setTickets(tickets.map(ticket =>
                ticket._id === ticketId ? { ...ticket, assignedTo: admins.find(admin => admin._id === adminId) } : ticket
            ));
        }
    };

    const updateTicketPriority = async (ticketId, newPriority) => {
        const response = await fetch('/api/ticket', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ticketId, priority: newPriority }),
        });

        if (response.ok) {
            setTickets(tickets.map(ticket =>
                ticket._id === ticketId ? { ...ticket, priority: newPriority } : ticket
            ));
        }
    };

    // Funkcja do filtrowania przypisanych ticketów
    const getAssignedTickets = (adminId) => {
        return tickets.filter(ticket => ticket.assignedTo && ticket.assignedTo._id === adminId);
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Tickets</h2>

            {/* Przełącznik zakładek */}
            <div className="mb-6">
                <button onClick={() => setActiveTab('unassigned')} className={`mr-4 ${activeTab === 'unassigned' ? 'font-bold' : ''}`}>
                    Unassigned Tickets
                </button>
                <button onClick={() => setActiveTab('assigned')} className={`mr-4 ${activeTab === 'assigned' ? 'font-bold' : ''}`}>
                    Assigned Tickets
                </button>
            </div>

            {activeTab === 'unassigned' && (
                <div>
                    <h3 className="text-xl font-bold mb-4">Unassigned Tickets</h3>
                    <ul className="space-y-4">
                        {tickets.filter(ticket => !ticket.assignedTo).map(ticket => (
                            <li key={ticket._id} className="bg-white shadow-md rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">{ticket.title}</h3>
                                <p className="text-gray-600 mb-4">{ticket.description}</p>
                                <p className="text-sm text-gray-500 mb-4">Category: {ticket.category}</p>
                                {ticket.taskId && (
                                    <p className="text-sm text-gray-500 mb-4">Related Task: {ticket.taskId.title}</p>
                                )}
                                <p className="text-sm text-gray-500 mb-4">Created At: {new Date(ticket.createdAt).toLocaleString()}</p>

                                {/* Przypisanie ticketa do admina */}
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-700 mb-2">Assign to Admin:</label>
                                    <select
                                        onChange={(e) => assignTicketToAdmin(ticket._id, e.target.value)}
                                        className="p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">None</option>
                                        {admins.map(admin => (
                                            <option key={admin._id} value={admin._id}>
                                                {admin.name} ({admin.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'assigned' && (
                <div>
                    <h3 className="text-xl font-bold mb-4">Assigned Tickets</h3>
                    <ul className="space-y-4">
                        {getAssignedTickets(adminId).map(ticket => ( // Użyj adminId do filtracji
                            <li key={ticket._id} className="bg-white shadow-md rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">{ticket.title}</h3>
                                <p className="text-gray-600 mb-4">{ticket.description}</p>
                                <p className="text-sm text-gray-500 mb-4">Category: {ticket.category}</p>
                                {ticket.taskId && (
                                    <p className="text-sm text-gray-500 mb-4">Related Task: {ticket.taskId.title}</p>
                                )}

                                {ticket.imageUrl && (
                                    <div className="mb-4">
                                        <img src={ticket.imageUrl} alt="Ticket screenshot" className="w-full h-auto max-w-xs object-cover rounded-md shadow-md" />
                                    </div>
                                )}

                                <p className="text-sm text-gray-500 mb-4">Status: <span className={`font-semibold ${ticket.status === 'closed' ? 'text-red-500' : 'text-blue-500'}`}>{ticket.status}</span></p>
                                <p className="text-sm text-gray-500 mb-4">Priority: {ticket.priority || 'None'}</p>
                                <p className="text-sm text-gray-500 mb-4">Created At: {new Date(ticket.createdAt).toLocaleString()}</p>

                                <p className="text-sm text-gray-500 mb-4">Created by: {ticket.createdBy ? `${ticket.createdBy.name} (${ticket.createdBy.email})` : 'Unknown'}</p>

                                {/* Zmiana statusu ticketa */}
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-700 mb-2">Update Status:</label>
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => updateTicketStatus(ticket._id, e.target.value)}
                                        className="p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>

                                {/* Zmiana priorytetu */}
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-700 mb-2">Update Priority:</label>
                                    <select
                                        value={ticket.priority || ''}
                                        onChange={(e) => updateTicketPriority(ticket._id, e.target.value)}
                                        className="p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">None</option>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TicketListAdmin;
