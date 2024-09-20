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
    const { id, status } = await req.json();
    await dbConnect();
    await updateTicket(id, { status });
    return new NextResponse("Ticket updated", { status: 200 });
};
