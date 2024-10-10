"use client";

import SocialLogin from "./SocialLogin";
import { doCredentialLogin } from "../app/actions/index";
import { useRouter } from "next/navigation";
import { useState } from "react";


const ErrorMessage = ({ message }) => {
  return message ? <p style={{ color: 'red' }}>{message}</p> : null;
};


const InputField = ({ label, type, name, id, required }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
      {label}
    </label>
    <input
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
      type={type}
      name={name}
      id={id}
      required={required}
    />
  </div>
);


const handleSubmit = async (event, setErrorMessage, router) => {
  event.preventDefault();
  setErrorMessage('');

  const formData = new FormData(event.currentTarget);
  const response = await doCredentialLogin(formData);

  if (response?.error) {
    setErrorMessage('Invalid credentials.');
  } else {
    router.push("/home");
  }
};


const LoginForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <>
      <ErrorMessage message={errorMessage} />

      <form
        className="w-full max-w-md bg-white shadow-md rounded-lg p-6"
        onSubmit={(e) => handleSubmit(e, setErrorMessage, router)}
      >
        <InputField label="Email Address" type="email" name="email" id="email" required />
        <InputField label="Password" type="password" name="password" id="password" required />

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
