import { loginAction } from "@/app/actions";
import { AuthForm } from "@/components/AuthForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/home");

  return <AuthForm title="Log In" action={loginAction} submitLabel="Log In" altHref="/signup" altLabel="Need an account? Sign up" />;
}
