import { Inter } from "next/font/google";
import "./globals.css";
import { dbConnect } from "../lib/mongo";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Task Manager",
  description: "nie wiem",
};

export default async function RootLayout({ children }) {
  const conn = await dbConnect();
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
