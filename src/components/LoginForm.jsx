"use client";

import SocialLogin from "./SocialLogin";
import { doCredentialLogin } from "../app/actions/index";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook do pobierania parametrów URL
  const error = searchParams.get("error"); // Pobranie parametru 'error' z URL
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error) {
      switch (error) {
        case 'Incorrect password':
          setErrorMessage('Invalid password. Please try again.');
          break;
        case 'User not found':
          setErrorMessage('Email not found. Please check your email.');
          break;
        case 'CredentialsSignin':
          setErrorMessage('Invalid email or password.');
          break;
        default:
          setErrorMessage('An error occurred. Please try again.');
      }
    }
  }, [error]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const response = await doCredentialLogin(formData);

      if (!response.error) {
        router.push("/home");
      } else {
        // Ustawiamy komunikat z odpowiedzi, tylko jeśli odpowiedź zawiera błąd
        setErrorMessage(response.error.message || "Invalid credentials. Please try again.");
      }
    } catch (e) {
      // Jeśli błąd nie został ustawiony wcześniej, wyświetlamy ten ogólny błąd
      if (!errorMessage) {
        setErrorMessage("An error occurred during login. Please try again.");
      }
    }
  }

  return (
    <>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
      <p className="text-2xl font-semibold text-gray-800 mb-6">
        or
      </p>
      <div className="mt-6">
        <SocialLogin />
      </div>
    </>
  );
};

export default LoginForm;
