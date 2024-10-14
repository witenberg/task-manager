import LoginForm from "../components/LoginForm"
import Link from "next/link"

interface HomeProps {
  headingText?: string
  registerText?: string
}

export default function Home({ 
  headingText = "Welcome to Task Manager", 
  registerText = "Don't have an account?" 
}: HomeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {headingText}
        </h1>
        <p className="text-xl text-gray-600">
          Organize your life, one task at a time
        </p>
      </div>
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">
        <LoginForm />
        <p className="text-sm text-gray-600 mt-6 text-center">
          {registerText}{" "}
          <Link href="/register" className="text-orange-500 hover:text-orange-600 underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}