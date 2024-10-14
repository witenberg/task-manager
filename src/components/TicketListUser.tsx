'use client'

import { useEffect, useState } from 'react'
import ChatBox from './ChatBox'
import TicketForm from './TicketForm'
import { Filter, SortAsc } from 'lucide-react'

interface Ticket {
  _id: string
  category: string
  title: string
  description: string
  createdAt: string
  status: 'open' | 'in-progress' | 'closed'
  priority: 'high' | 'medium' | 'low'
  taskId?: {
    title: string
    description: string
  }
  imageUrl?: string
  createdBy: {
    _id: string
  }
  assignedTo?: {
    _id: string
  }
}

interface TicketUserListProps {
  userId: string
}

const TicketUserList: React.FC<TicketUserListProps> = ({ userId }) => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("creationDate")
  const [openChatTicketId, setOpenChatTicketId] = useState<string | null>(null)

  const fetchTickets = async () => {
    try {
      const response = await fetch(`/api/ticket/`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const toggleChatBox = (ticketId: string) => {
    setOpenChatTicketId(openChatTicketId === ticketId ? null : ticketId)
  }

  const filteredTickets = tickets
    .filter(ticket => ticket.createdBy && ticket.createdBy._id === userId)
    .filter(ticket => {
      if (filterStatus === "open") return ticket.status === "open"
      if (filterStatus === "in-progress") return ticket.status === "in-progress"
      if (filterStatus === "closed") return ticket.status === "closed"
      return true
    })
    .sort((a, b) => {
      if (sortBy === "creationDate") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return 0
    })

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Ticket</h2>
        <TicketForm userId={userId} refreshTickets={fetchTickets} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Tickets</h2>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <SortAsc size={20} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="creationDate">Creation Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        <ul className="space-y-4">
          {filteredTickets.map((ticket) => (
            <li key={ticket._id} className="bg-gray-50 border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{ticket.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                  ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {ticket.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{ticket.description}</p>
              <p className="text-sm text-gray-500 mb-2">Category: {ticket.category}</p>
              <p className="text-sm text-gray-500 mb-2">Created: {new Date(ticket.createdAt).toLocaleString()}</p>
              {ticket.taskId && (
                <div className="mb-2">
                  <p className="text-sm text-gray-700 font-semibold">Related Task:</p>
                  <p className="text-sm text-gray-600">{ticket.taskId.title}</p>
                  <p className="text-sm text-gray-500">{ticket.taskId.description}</p>
                </div>
              )}
              {ticket.imageUrl && (
                <div className="mb-4">
                  <img src={ticket.imageUrl} alt="Ticket screenshot" className="w-full h-auto max-w-xs object-cover rounded-md shadow-sm" />
                </div>
              )}
              {ticket.status === 'in-progress' && (
                <button
                  onClick={() => toggleChatBox(ticket._id)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                  {openChatTicketId === ticket._id ? 'Close Chat' : 'Open Chat'}
                </button>
              )}
              {openChatTicketId === ticket._id && (
                <ChatBox 
                  ticket={ticket}
                  userId={userId} 
                  userRole='user'
                  onClose={() => toggleChatBox(ticket._id)}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TicketUserList