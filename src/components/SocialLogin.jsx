import { doSocialLogin } from "../app/actions/index";

const SocialLogin = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <form action={doSocialLogin}>
        <button
          type="submit"
          name="action"
          value="google"
          className="w-48 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200"
        >
          Log in with Google
        </button>
      </form>
      <form action={doSocialLogin}>
        <button
          type="submit"
          name="action"
          value="github"
          className="w-48 bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition duration-200"
        >
          Log in with GitHub
        </button>
      </form>
    </div>
  );
};

export default SocialLogin;
