"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import SocialLogin from "./SocialLogin"
import { doCredentialLogin } from "../actions/Login"
import ErrorMessage from "./ErrorMessage"
import InputField from "./InputField"

const LoginForm = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")

    const formData = new FormData(event.currentTarget)
    const response = await doCredentialLogin(formData)

    if (response?.error) {
      setErrorMessage("Invalid credentials.")
    } else {
      router.push("/home")
    }
  }

  return (
    <div className="w-full max-w-md">
      <ErrorMessage message={errorMessage} />

      <form
        className="bg-white shadow-2xl rounded-lg p-8"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to Your Account</h2>
        <InputField label="Email Address" type="email" name="email" id="email" required placeholder="you@example.com" />
        <InputField label="Password" type="password" name="password" id="password" required placeholder="••••••••" />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          Log in
        </button>
      </form>

      <div className="mt-8">
        <SocialLogin />
      </div>
    </div>
  )
}

export default LoginForm