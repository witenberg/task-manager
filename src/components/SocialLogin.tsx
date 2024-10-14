import SocialLoginButton from "./SocialLoginButton";
import { doSocialLogin } from "../actions/Login";
import React from "react";

const SocialLogin: React.FC = () => {
  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      <SocialLoginButton
        provider="google"
        providerName="Google"
        doSocialLogin={doSocialLogin}
      />
      <SocialLoginButton
        provider="github"
        providerName="GitHub"
        doSocialLogin={doSocialLogin}
      />
    </div>
  )
}

export default SocialLogin