"use client"

import SocialLogin from "./SocialLogin";
import { useRouter } from "next/navigation";

const RegistrationForm = () => {

    const router = useRouter();

    async function onSubmit(event){
        event.preventDefault();

        try {
            const formData = new FormData(event.currentTarget);

            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                })
            });

            response.status === 201 && router.push('/');

        }catch (e) {
            console.error(e.message);
        }
    }

    return (
        <>
            <form
                className="w-full max-w-md bg-white shadow-md rounded-lg p-6"
                onSubmit={onSubmit}
            >

                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                        Name
                    </label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                        type="text"
                        name="name"
                        id="name"
                        required
                    />
                </div>

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
                    Register
                </button>
            </form>
            <div className="mt-6">
                <SocialLogin />
            </div>
        </>
    )
}

export default RegistrationForm;