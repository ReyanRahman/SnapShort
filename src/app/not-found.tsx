import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl items-center justify-center px-6 py-12">
      <Card className="w-full p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">Not found</p>
        <h1 className="mt-4 text-4xl font-black text-[#111111]">That short link could not be found.</h1>
        <p className="mt-4 text-sm leading-7 text-[#5a5a5a]">
          It may have expired, been disabled, or never existed in the first place.
        </p>
        <div className="mt-6">
          <Link href="/">
            <Button size="lg">Create a new link</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
