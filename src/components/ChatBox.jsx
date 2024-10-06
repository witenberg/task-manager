import { useState, useEffect, useRef } from 'react';

const ChatBox = ({ ticket, userId, userRole, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`/api/messages?ticketId=${ticket._id}`);
                const data = await response.json();
                if (response.ok) {
                    setMessages(data.messages);
                }
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };

        fetchMessages();
    }, [ticket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticketId: ticket._id,
                    senderId: userId,
                    receiverId: userRole === 'user' ? ticket.assignedTo._id : ticket.createdBy._id,
                    message: newMessage,
                }),
            });

            if (response.ok) {
                const newMessage = await response.json();
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setNewMessage("");
            }
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg w-96 max-h-[calc(50vh)] flex flex-col">
            {/* Nagłówek */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-bold">{ticket.title} - Chat</h3>
                <button onClick={onClose} className="text-red-500 hover:text-red-700">
                    Close
                </button>
            </div>

            {/* Kontener wiadomości */}
            <div className="flex-1 p-16 overflow-y-auto" style={{ maxHeight: 'calc(50vh - 110px)' }}>
                {messages.map((msg) => (
                    <div 
                    key={msg._id} 
                    className={`mb-4 ${msg.senderId._id.toString() === userId ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block px-4 py-2 rounded-lg ${msg.senderId._id.toString() === userId ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <p className="text-sm">{msg?.message || "Brak treści"}</p>
                            <span className="text-xs text-gray-500">{msg?.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}</span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Pole wpisywania wiadomości */}
            <div className="p-4 border-t border-gray-200 flex items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Napisz wiadomość..."
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
