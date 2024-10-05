"use client"

import { useEffect, useState } from 'react';
import ChatBox from '../components/ChatBox';

const TicketUserList = ({ userId }) => {
    const [tickets, setTickets] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("creationDate");
    const [openChatTicketId, setOpenChatTicketId] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(`/api/ticket/`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Tickets data: ", data); // Dodaj ten log
                setTickets(data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };

        fetchTickets();
    }, []);

    const toggleChatBox = (ticketId) => {
        setOpenChatTicketId(openChatTicketId === ticketId ? null : ticketId);
    };

    const filteredTickets = tickets.filter(ticket => ticket.createdBy && ticket.createdBy._id === userId)
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
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Your tickets</h2>
    
                {/* Filtry i sortowanie */}
                <div className="mb-4 flex space-x-4">
                    {/* Filtr statusu */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">Filter by Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md"
                        >
                            <option value="all">All</option>
                            <option value="open">Open</option>
                            <option value="in-progress">In progress</option>
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
                    {filteredTickets.map(ticket => (
                        <li key={ticket._id} className="bg-white shadow-md rounded-lg p-6 relative">
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
    
                            {/* Przycisk do otwierania/zamykania czatu */}
                            <button onClick={() => toggleChatBox(ticket._id)} className="absolute bottom-4 right-4 text-blue-500 hover:underline">
                                {openChatTicketId === ticket._id ? 'Close Chat' : 'Open Chat'}
                            </button>
    
                            {/* Komponent ChatBox */}
                            {openChatTicketId === ticket._id && (
                                <ChatBox ticket={ticket} userId={userId} userRole={'user'} onClose={() => toggleChatBox(ticket._id)} />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };
    
    export default TicketUserList;