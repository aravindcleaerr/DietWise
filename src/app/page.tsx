"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function Home() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);

  useEffect(() => {
    if (profile?.isOnboarded) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding");
    }
  }, [profile, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="text-4xl font-bold text-primary mb-2">DietWise</div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
