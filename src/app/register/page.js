import React from "react";
import RegistrationForm from "../../components/RegistrationForm";
import Link from "next/link";

const RegisterPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <p className="text-2xl font-semibold text-gray-800 mb-6">
                Create new accout
            </p>
            <RegistrationForm />
            <p className="text-2xl font-semibold text-gray-800 mb-6">
                Already have and account?
                <Link href="/" className="mx-2 underline">
                    Login
                </Link>
            </p>
        </div>
    )
}

export default RegisterPage;