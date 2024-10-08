import LoginForm from "../components/LoginForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <p className="text-2xl font-semibold text-gray-800 mb-6">
        Log in to your account
      </p>
      <LoginForm />
      <p className="text-sm text-gray-600 mt-4">
        Don't have an account?{" "}
        <Link href="/register" className="text-orange-500 hover:text-orange-600 underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
