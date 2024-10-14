import React from "react";
import RegistrationForm from "../../components/RegistrationForm";
import LoginLink from "../../components/LoginLink";

const RegisterPage = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Create a new account
          </h1>
          <p className="text-xl text-gray-600">
            Join Task Manager and start organizing your life
          </p>
        </div>
        <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">
          <RegistrationForm />
          <LoginLink />
        </div>
      </div>
    )
  }
  
  export default RegisterPage