import { SignUp } from "@clerk/nextjs";
import { RedirectUrl } from "@clerk/nextjs/server";
 
const SignUpPage = () => {
  return <SignUp afterSignUpUrl="/new-user" redirectUrl="/new-user" />;
}

export default SignUpPage