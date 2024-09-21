import { NextResponse } from 'next/server';
import { createTicket, findAllTickets, updateTicket } from '../../../queries/tickets';
import { dbConnect } from '../../../lib/mongo';

export const POST = async (req) => {
    const { userId, taskId, title, description } = await req.json();
    
    await dbConnect();

    console.log(taskId, title, description, userId);

    const newTicket = await createTicket({ title, description, createdBy: userId, taskId });
    return new NextResponse(JSON.stringify(newTicket), { status: 201 });
};

export const GET = async () => {
    await dbConnect();
    const tickets = await findAllTickets();
    return new NextResponse(JSON.stringify(tickets), { status: 200 });
};

export const PUT = async (req) => {
    const { ticketId, status } = await req.json();  // Odbierz ID i status z treści żądania

    console.log("TICKET ID: ", ticketId);
    console.log("STATUS: ", status);

    await dbConnect();

    try {
        const updatedTicket = await updateTicket(ticketId, { status });

        if (!updatedTicket) {
            return new NextResponse("Ticket not found", { status: 404 });
        }

        return new NextResponse(JSON.stringify(updatedTicket), { status: 200 });
    } catch (error) {
        return new NextResponse(`Error updating ticket: ${error.message}`, { status: 500 });
    }
};
