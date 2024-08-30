import LoginForm from "../components/LoginForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <p className="text-2xl font-semibold text-gray-800 mb-6">
        Log in to your account
      </p>
      <LoginForm />
    </div>
  );
}
