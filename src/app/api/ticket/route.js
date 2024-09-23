import { NextResponse } from 'next/server';
import { createTicket, findAllTickets, updateTicket } from '../../../queries/tickets';
import { dbConnect } from '../../../lib/mongo';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
  const formData = await req.formData();
  const userId = formData.get("userId");
  const taskId = formData.get("taskId");
  const title = formData.get("title");
  const description = formData.get("description");
  const category = formData.get("category");

  await dbConnect();

  let imageUrl = null;
  const imageFile = formData.get("screenshot");

  if (imageFile && imageFile.size > 0) {
    try {
      // Funkcja czekająca na przesłanie pliku do Cloudinary
      const uploadImage = async () => {
        return new Promise(async (resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "tickets" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          );

          // Konwertuj plik do bufora i prześlij
          const arrayBuffer = await imageFile.arrayBuffer(); // Poprawiono asynchroniczne pobieranie arrayBuffer
          const buffer = Buffer.from(arrayBuffer);
          uploadStream.end(buffer);
        });
      };

      imageUrl = await uploadImage();  // Czekaj na zakończenie przesyłania
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return new NextResponse("Error uploading image", { status: 500 });
    }
  }

  // Tworzenie nowego ticketa z linkiem do obrazu
  const newTicket = await createTicket({
    title,
    description,
    category,
    createdBy: userId,
    taskId: category === "task" ? taskId : null,
    imageUrl,
  });

  return new NextResponse(JSON.stringify(newTicket), { status: 201 });
};

export const GET = async () => {
  await dbConnect();
  const tickets = await findAllTickets();
  return new NextResponse(JSON.stringify(tickets), { status: 200 });
};

export const PUT = async (req) => {
  const { ticketId, status } = await req.json();

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
