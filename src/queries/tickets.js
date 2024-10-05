import Ticket from "../models/ticket";

export async function createTicket(ticketData) {
    console.log(ticketData);
    try {
        const ticket = await Ticket.create(ticketData);
        return ticket;
    } catch (error) {
        console.error("Error creating ticket: ", error);
        throw new Error(error.message);
    }
}

export const findAllTickets = async() => {
    try {
      const tickets = await Ticket.find()
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .populate('taskId');
        return tickets;
    } catch (error) {
      console.error("Error fetching tickets: ", error);
      throw new Error(error.message);
    }
  };

export async function updateTicket(id, updates) {
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(id, updates, { new: true });
        return updatedTicket;
    } catch (error) {
        console.error("Error updating ticket: ", error);
        throw new Error(error.message);
    }
}
