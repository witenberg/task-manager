import SocialLoginButton from "./SocialLoginButton";
import { doSocialLogin } from "../actions/Login";

const SocialLogin = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <SocialLoginButton
        provider="google"
        providerName="Google"
        className="w-48 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200"
        doSocialLogin={doSocialLogin}
      />

      <SocialLoginButton
        provider="github"
        providerName="GitHub"
        className="w-48 bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition duration-200"
        doSocialLogin={doSocialLogin}
      />
    </div>
  );
};

export default SocialLogin;
