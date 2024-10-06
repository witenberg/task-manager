import Message from '../../../models/message';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    const newMessage = await Message.create({
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error while adding message: ", error);
    
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}


export const GET = async (req) => {
    try {
      const { searchParams } = new URL(req.url);
      const ticketId = searchParams.get('ticketId');
  
      if (!ticketId) {
        return NextResponse.json({ error: 'Missing ticketId' }, { status: 400 });
      }
  
      const messages = await Message.find({ ticketId })
        .sort({ createdAt: 1 })
        .populate('senderId receiverId', 'name email');
  
      return NextResponse.json({ messages }, { status: 200 });
    } catch (error) {
      console.error("Error while retrieving messages: ", error);
      return NextResponse.json({ error: 'Failed to retrieve messages' }, { status: 500 });
    }
};
