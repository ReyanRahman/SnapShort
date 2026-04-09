import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { getServerAuthSession } from "@/lib/auth";

import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const session = await getServerAuthSession();

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[#f7f4ef]/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111111] text-sm font-black text-white">
            SS
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111111]">SnapShort</p>
            <p className="text-xs text-[#6a6a6a]">Short links, shared clearly.</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[#4b4b4b] md:flex">
          <Link href="/#features">Features</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">
                  Dashboard
                </Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Create account</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
