"use client";

import SocialLogin from "./SocialLogin";
import { doCredentialLogin } from "../app/actions/index";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);

      const response = await doCredentialLogin(formData);

      if (!!response.error) {
        console.error(response.error);
        setError(response.error.message);
      } else {
        router.push("/home");
      }
    } catch (e) {
      console.error(e);
      setError("Check your Credentials");
    }
  }

  return (
    <>
      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}
      <form
        className="w-full max-w-md bg-white shadow-md rounded-lg p-6"
        onSubmit={onSubmit}
      >
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
            type="email"
            name="email"
            id="email"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
            type="password"
            name="password"
            id="password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition duration-200"
        >
          Log in
        </button>
      </form>
      <div className="mt-6">
        <SocialLogin />
      </div>
    </>
  );
};

export default LoginForm;
