const SocialLoginButton = ({ provider, providerName, className, doSocialLogin }) => {
    return (
      <form action={doSocialLogin}>
        <button
          type="submit"
          name="action"
          value={provider}
          className={className}
        >
          Sign in with {providerName}
        </button>
      </form>
    );
  };
  
  export default SocialLoginButton;
  