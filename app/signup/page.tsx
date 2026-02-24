import { signupAction } from "@/app/actions";
import { AuthForm } from "@/components/AuthForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const session = await getSession();
  if (session) redirect("/home");

  return (
    <AuthForm
      title="Sign Up"
      action={signupAction}
      submitLabel="Create Account"
      altHref="/login"
      altLabel="Already have an account? Log in"
      includeConfirm
    />
  );
}
