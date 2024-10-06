import { dbConnect } from '../../../lib/mongo';
import User from '../../../models/user';

export async function GET() {
  try {
    await dbConnect();

    const admins = await User.find({
      $or: [
          { role: 'admin' },
          { role: 'root' }
      ]
  }).select('name email role');

    return new Response(JSON.stringify(admins), { status: 200 });
  } catch (error) {
    console.error('Błąd podczas pobierania listy adminów:', error);
    return new Response('Błąd serwera', { status: 500 });
  }
}
