import React from "react";
import RegistrationForm from "../../components/RegistrationForm";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <p className="text-2xl font-semibold text-gray-800 mb-6">
        Create a new account
      </p>
      <RegistrationForm />
      <p className="text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <Link href="/" className="text-orange-500 hover:text-orange-600 underline">
          Log in here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
