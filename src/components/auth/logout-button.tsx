"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      size="sm"
      onClick={() => {
        void signOut({ callbackUrl: "/" });
      }}
      type="button"
    >
      Logout
    </Button>
  );
}
