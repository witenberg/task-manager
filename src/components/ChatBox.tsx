'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, X } from  'lucide-react'

interface Message {
  _id: string
  senderId: {
    _id: string
  }
  message: string
  createdAt: string
}

interface ChatBoxProps {
  ticket: {
    _id: string
    title: string
    assignedTo?: {
      _id: string
    }
    createdBy: {
      _id: string
    }
  }
  userId: string
  userRole: 'user' | 'admin'
  onClose: () => void
}

const ChatBox: React.FC<ChatBoxProps> = ({ ticket, userId, userRole, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages?ticketId=${ticket._id}`)
        const data = await response.json()
        if (response.ok) {
          setMessages(data.messages)
        }
      } catch (error) {
        console.error("Failed to fetch messages", error)
      }
    }

    fetchMessages()
  }, [ticket._id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticket._id,
          senderId: userId,
          receiverId: userRole === 'user' ? ticket.assignedTo?._id : ticket.createdBy._id,
          message: newMessage,
        }),
      })

      if (response.ok) {
        const newMessageData = await response.json()
        const formattedMessage = {
          ...newMessageData,
          senderId: { _id: userId },
        }
        setMessages((prevMessages) => [...prevMessages, formattedMessage])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Failed to send message", error)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg w-96 max-h-[calc(100vh-8rem)] flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-blue-500 text-white rounded-t-lg">
        <h3 className="text-lg font-bold">{ticket.title} - Chat</h3>
        <button onClick={onClose} className="text-white hover:text-red-200 transition-colors duration-200">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 30rem)' }}>
        {messages.map((msg) => (
          <div 
            key={msg._id} 
            className={`mb-4 ${msg.senderId._id === userId ? 'text-right' : 'text-left'}`}
          >
            <div className={`inline-block px-4 py-2 rounded-lg ${
              msg.senderId._id === userId ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="text-sm">{msg?.message || "No content"}</p>
              <span className="text-xs text-gray-500">{msg?.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}

export default ChatBox