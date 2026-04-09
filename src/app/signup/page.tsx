import Link from "next/link";

import { SignupForm } from "@/components/forms/signup-form";

export default function SignupPage() {

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center px-6 py-12">
      <div className="w-full">
        <SignupForm />
        <p className="mt-4 text-center text-sm text-[#5a5a5a]">
          Already have an account?{" "}
          <Link className="font-semibold text-[#b93810]" href="/login">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
