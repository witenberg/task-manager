import Link from "next/link";

const LoginLink = () => {
    return (
        <p className="text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/" className="text-orange-500 hover:text-orange-600 underline">
                Log in here
            </Link>
        </p>
    );
};

export default LoginLink;
