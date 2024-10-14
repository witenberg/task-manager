import React from 'react'
import { FaGoogle, FaGithub } from 'react-icons/fa'

interface SocialLoginButtonProps {
  provider: 'google' | 'github'
  providerName: string
  className?: string
  doSocialLogin: (formData: FormData) => Promise<void>
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ provider, providerName, className, doSocialLogin }) => {
  const baseClassName = "w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold text-white transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
  const providerSpecificClass = provider === 'google' 
    ? "bg-red-500 hover:bg-red-600" 
    : "bg-gray-800 hover:bg-gray-900"

  const Icon = provider === 'google' ? FaGoogle : FaGithub

  return (
    <form action={doSocialLogin}>
      <button
        type="submit"
        name="action"
        value={provider}
        className={`${baseClassName} ${providerSpecificClass} ${className}`}
      >
        <Icon className="w-5 h-5" />
        <span>Sign in with {providerName}</span>
      </button>
    </form>
  )
}

export default SocialLoginButton