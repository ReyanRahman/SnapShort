import Link from "next/link";

import { LoginForm } from "@/components/forms/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center px-6 py-12">
      <div className="w-full">
        <LoginForm callbackUrl={callbackUrl} />
        <p className="mt-4 text-center text-sm text-[#5a5a5a]">
          Need an account?{" "}
          <Link className="font-semibold text-[#b93810]" href="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
