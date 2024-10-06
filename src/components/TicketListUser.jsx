"use client";

import { useEffect, useState } from 'react';
import ChatBox from '../components/ChatBox';
import TicketForm from './TicketForm';

const TicketUserList = ({ userId }) => {
    const [tickets, setTickets] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("creationDate");
    const [openChatTicketId, setOpenChatTicketId] = useState(null);

    // Funkcja do pobierania ticketów
    const fetchTickets = async () => {
        try {
            const response = await fetch(`/api/ticket/`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    // Wywołaj `fetchTickets` przy pierwszym renderowaniu komponentu
    useEffect(() => {
        fetchTickets();
    }, []);

    // Funkcja do przełączania widoczności ChatBox
    const toggleChatBox = (ticketId) => {
        setOpenChatTicketId(openChatTicketId === ticketId ? null : ticketId);
    };

    // Filtruj i sortuj tickety
    const filteredTickets = tickets
        .filter(ticket => ticket.createdBy && ticket.createdBy._id === userId)
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

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Add ticket</h2>

            {/* Przekaż funkcję `fetchTickets` do `TicketForm` */}
            <TicketForm userId={userId} refreshTickets={fetchTickets} />

            <div className="mb-8" />

            <div className="mb-4 flex space-x-4">
                <div>
                    <label className="block text-sm text-gray-700 mb-2">Filter by Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md"
                    >
                        <option value="all">All</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm text-gray-700 mb-2">Sort by</label>
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

            {/* Lista ticketów */}
            <ul>
                {filteredTickets.map((ticket) => (
                    <li key={ticket._id} className="bg-white border p-6 mb-4 rounded-lg shadow-md">
                        {/* Informacje podstawowe */}
                        <p className="text-gray-600 mb-2">Category: {ticket.category}</p>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">{ticket.title}</h3>
                        <p className="text-sm text-gray-500 mb-2"><span className="font-semibold">Opis:</span> {ticket.description}</p>
                        <p className="text-sm text-gray-500 mb-2">Created: {new Date(ticket.createdAt).toLocaleString()}</p>
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
                        <p className="text-sm mb-2">
                            <span className="font-semibold">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded ${ticket.status === 'open' ? 'bg-green-500 text-white' :
                                ticket.status === 'in-progress' ? 'bg-yellow-500 text-white' :
                                    'bg-red-500 text-white'
                                }`}>
                                {ticket.status}
                            </span>
                        </p>

                        {ticket.status === 'in-progress' && (
                            <button
                                onClick={() => toggleChatBox(ticket._id)}
                                className="text-blue-500 mt-2"
                            >
                                {openChatTicketId === ticket._id ? 'Close Chat' : 'Open Chat'}
                            </button>
                        )}

                        {openChatTicketId === ticket._id && (
                            <ChatBox ticketId={ticket._id} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TicketUserList;
