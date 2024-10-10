import React from "react";
import RegistrationForm from "../../components/RegistrationForm";
import LoginLink from "../../components/LoginLink";

const RegisterPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <p className="text-2xl font-semibold text-gray-800 mb-6">
                Create a new account
            </p>
            <RegistrationForm />
            <LoginLink />
        </div>
    );
};

export default RegisterPage;
