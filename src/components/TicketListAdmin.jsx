"use client";

import { useEffect, useState } from 'react';
import ChatBox from '../components/ChatBox';

const TicketListAdmin = ({ role, adminId }) => {
    const [tickets, setTickets] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("creationDate");
    const [activeTab, setActiveTab] = useState(role === 'root' ? 'unassigned' : 'assigned');
    const [expandedTicketId, setExpandedTicketId] = useState(null);
    const [activeChatTicket, setActiveChatTicket] = useState(null);

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

    const getAssignedTickets = (adminId) => {
        return tickets.filter(ticket => ticket.assignedTo && ticket.assignedTo._id === adminId);
    };

    const filteredAndSortedTickets = getAssignedTickets(adminId)
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

    const toggleTicketExpansion = (ticketId) => {
        setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId);
    };

    const openChat = (ticket) => {
        setActiveChatTicket(ticket);
    };

    const closeChat = () => {
        setActiveChatTicket(null);
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Tickets</h2>

            {/* Przełącznik zakładek */}
            <div className="mb-6">
                {role === 'root' && (
                    <button onClick={() => setActiveTab('unassigned')} className={`mr-4 ${activeTab === 'unassigned' ? 'font-bold' : ''}`}>
                        Unassigned Tickets
                    </button>
                )}
                <button onClick={() => setActiveTab('assigned')} className={`mr-4 ${activeTab === 'assigned' ? 'font-bold' : ''}`}>
                    Your Tickets
                </button>
            </div>

            {activeTab === 'unassigned' && role === 'root' && (
                <div>
                    <h3 className="text-xl font-bold mb-4">Unassigned Tickets</h3>
                    <ul className="space-y-4">
                        {tickets.filter(ticket => !ticket.assignedTo).map(ticket => (
                            <li key={ticket._id} className="bg-white shadow-md rounded-lg p-6">
                                {/* Informacje podstawowe */}
                                <p className="text-gray-600 mb-2">Category: {ticket.category}</p>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">{ticket.title}</h3>
                                <p className="text-sm text-gray-500 mb-2"><span className="font-semibold">Description:</span> {ticket.description}</p>
                                <p className="text-sm text-gray-500 mb-2">Created At: {new Date(ticket.createdAt).toLocaleString()}</p>

                                {/* Rozwinięcie ticketa */}
                                <button
                                    className="text-blue-500 hover:underline mb-4"
                                    onClick={() => toggleTicketExpansion(ticket._id)}
                                >
                                    {expandedTicketId === ticket._id ? "Collapse" : "Expand"}
                                </button>

                                {expandedTicketId === ticket._id && (
                                    <div className="border-t border-gray-200 pt-4">
                                        {/* Szczegóły ticketa */}

                                        {ticket.taskId && (
                                            <p className="text-sm text-gray-500 mb-2"><span className="font-semibold">Related Task:</span> {ticket.taskId.title}</p>
                                        )}

                                        {ticket.taskId && (
                                            <p className="text-sm text-gray-500 mb-2"><span className="font-semibold">Task Description:</span> {ticket.taskId.description}</p>
                                        )}

                                        {ticket.imageUrl && (
                                            <div className="mb-4">
                                                <img src={ticket.imageUrl} alt="Ticket screenshot" className="w-full h-auto max-w-xs object-cover rounded-md shadow-md" />
                                            </div>
                                        )}

                                        <p className="text-sm text-gray-500 mb-2">Created By:
                                            {ticket.createdBy ? ` ${ticket.createdBy.name} (${ticket.createdBy.email})` : ' Unknown'}
                                        </p>

                                        {/* Kolorowanie priorytetów */}
                                        <p className="text-sm mb-2">
                                            <span className="font-semibold">Priority:</span>
                                            <span className={`ml-2 px-2 py-1 rounded ${ticket.priority === 'high' ? 'bg-red-500 text-white' :
                                                ticket.priority === 'medium' ? 'bg-yellow-500 text-white' :
                                                    'bg-green-500 text-white'
                                                }`}>
                                                {ticket.priority || 'None'}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="block text-sm text-gray-700 mb-2">Update Priority:</label>
                                    <select
                                        value={ticket.priority || ''}
                                        onChange={(e) => updateTicketPriority(ticket._id, e.target.value)}
                                        className="p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

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

                    {/* Filtry i sortowanie */}
                    <div className="mb-4 flex space-x-4">
                        {/* Filtr statusu */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Filter by Status:</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md"
                            >
                                <option value="all">All</option>
                                <option value="open">Open</option>
                                <option value="in-progress">In-Progress</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>

                        {/* Sortowanie */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md"
                            >
                                <option value="creationDate">Creation Date</option>
                                <option value="priority">Priority</option>
                            </select>
                        </div>
                    </div>

                    <ul className="space-y-4">
                        {filteredAndSortedTickets.map(ticket => (
                            <li key={ticket._id} className="bg-white shadow-md rounded-lg p-6">
                                {/* Informacje podstawowe */}
                                <p className="text-gray-600 mb-2">Category: {ticket.category}</p>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">{ticket.title}</h3>
                                <p className="text-sm text-gray-500 mb-2"><span className="font-semibold">Description:</span> {ticket.description}</p>
                                <p className="text-sm text-gray-500 mb-2">Created At: {new Date(ticket.createdAt).toLocaleString()}</p>

                                {/* Rozwinięcie ticketa */}
                                <button
                                    className="text-blue-500 hover:underline mb-4"
                                    onClick={() => toggleTicketExpansion(ticket._id)}
                                >
                                    {expandedTicketId === ticket._id ? "Collapse" : "Expand"}
                                </button>

                                {expandedTicketId === ticket._id && (
                                    <div className="border-t border-gray-200 pt-4">
                                        {/* Szczegóły ticketa */}
                                        {ticket.taskId && (
                                            <p className="text-sm text-gray-500 mb-2"><span className="font-semibold">Related Task:</span> {ticket.taskId.title}</p>
                                        )}

                                        {ticket.taskId && (
                                            <p className="text-sm text-gray-500 mb-2"><span className="font-semibold">Task Description:</span> {ticket.taskId.description}</p>
                                        )}

                                        {ticket.imageUrl && (
                                            <div className="mb-4">
                                                <img src={ticket.imageUrl} alt="Ticket screenshot" className="w-full h-auto max-w-xs object-cover rounded-md shadow-md" />
                                            </div>
                                        )}

                                        <p className="text-sm text-gray-500 mb-2">Created By:
                                            {ticket.createdBy ? ` ${ticket.createdBy.name} (${ticket.createdBy.email})` : ' Unknown'}
                                        </p>
                                    </div>
                                )}

                                {/* Kolorowanie priorytetów */}
                                <p className="text-sm mb-2">
                                    <span className="font-semibold">Priority:</span>
                                    <span className={`ml-2 px-2 py-1 rounded ${ticket.priority === 'high' ? 'bg-red-500 text-white' :
                                        ticket.priority === 'medium' ? 'bg-yellow-500 text-white' :
                                            'bg-green-500 text-white'
                                        }`}>
                                        {ticket.priority || 'None'}
                                    </span>
                                </p>

                                {/* Przyciski zarządzania statusem ticketa i czatem */}
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-4">
                                        {ticket.status === 'open' && (
                                            <button
                                                onClick={() => updateTicketStatus(ticket._id, 'in-progress')}
                                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                            >
                                                Start Progress
                                            </button>
                                        )}

                                        {ticket.status === 'in-progress' && (
                                            <button
                                                onClick={() => updateTicketStatus(ticket._id, 'closed')}
                                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                            >
                                                Close Ticket
                                            </button>
                                        )}
                                    </div>

                                    {ticket.status === 'in-progress' && (
                                        <button
                                            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                            onClick={() => openChat(ticket)}
                                        >
                                            Otwórz czat
                                        </button>
                                    )}
                                </div>

                                {activeChatTicket && (
                                    <ChatBox
                                        ticket={activeChatTicket}
                                        userId={adminId}
                                        userRole={role}
                                        onClose={closeChat}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>

                </div>
            )}
        </div>
    );
};

export default TicketListAdmin;
