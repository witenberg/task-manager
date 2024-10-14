"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import SocialLogin from "./SocialLogin"
import InputField from "./InputField"

const RegistrationForm = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState("")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage("")

    try {
      const formData = new FormData(event.currentTarget)

      const name = formData.get("name")
      const email = formData.get("email")
      const password = formData.get("password")

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (response.status === 201) {
        router.push("/")
      } else if (response.status === 409) {
        setErrorMessage("User with this email already exists.")
      } else {
        setErrorMessage("An unexpected error occurred.")
      }
    } catch (e) {
      console.error(e)
      setErrorMessage("An error occurred during registration.")
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        {errorMessage && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
        <InputField
          label="Name"
          type="text"
          name="name"
          id="name"
          required
          placeholder="John Doe"
        />
        <InputField
          label="Email Address"
          type="email"
          name="email"
          id="email"
          required
          placeholder="john@example.com"
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          id="password"
          required
          placeholder="••••••••"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          Register
        </button>
      </form>
      <div className="mt-8">
        <SocialLogin />
      </div>
    </>
  )
}

export default RegistrationForm