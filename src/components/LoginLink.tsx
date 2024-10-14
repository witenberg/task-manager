import Link from "next/link"

const LoginLink = () => {
  return (
    <p className="text-sm text-gray-600 mt-6 text-center">
      Already have an account?{" "}
      <Link
        href="/"
        className="text-orange-500 hover:text-orange-600 underline font-semibold transition duration-300"
      >
        Log in here
      </Link>
    </p>
  )
}

export default LoginLink