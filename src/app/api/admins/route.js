import { dbConnect } from '../../../lib/mongo';
import User from '../../../models/user';

export async function GET(req, res) {
  try {
    await dbConnect();

    const admins = await User.find({ role: 'admin' }).select('name email role');

    return new Response(JSON.stringify(admins), { status: 200 });
  } catch (error) {
    console.error('Błąd podczas pobierania listy adminów:', error);
    return new Response('Błąd serwera', { status: 500 });
  }
}
