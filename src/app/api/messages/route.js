import Message from '../../../models/message';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    // Logika dodawania wiadomości do bazy danych
    const newMessage = await Message.create({
      ...body,
      createdAt: new Date(),
    });

    // Poprawne użycie metody status() na obiekcie NextResponse
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error while adding message: ", error);
    
    // Poprawne zwrócenie odpowiedzi błędu
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}


export const GET = async (req) => {
    try {
      // Uzyskanie parametrów zapytania z URL
      const { searchParams } = new URL(req.url);
      const ticketId = searchParams.get('ticketId');
  
      if (!ticketId) {
        // Poprawne zwrócenie odpowiedzi błędu przy braku ticketId
        return NextResponse.json({ error: 'Missing ticketId' }, { status: 400 });
      }
  
      // Pobranie wiadomości na podstawie ticketId
      const messages = await Message.find({ ticketId })
        .sort({ createdAt: 1 })
        .populate('senderId receiverId', 'name email');
  
      return NextResponse.json({ messages }, { status: 200 });
    } catch (error) {
      console.error("Error while retrieving messages: ", error);
      return NextResponse.json({ error: 'Failed to retrieve messages' }, { status: 500 });
    }
};
