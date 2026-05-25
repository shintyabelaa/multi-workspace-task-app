"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSlug } from "@/lib/utils";
import { Workspace } from "./components/Sidebar";

export default function Home() {
  const router = useRouter();
  const [hasWorkspaces, setHasWorkspaces] = useState<boolean | null>(null);
  useEffect(() => {
    const storedWorkspaces = localStorage.getItem("workspaces");

    if (!storedWorkspaces) {
      setHasWorkspaces(false);
      return;
    }

    const workspaces: Workspace[] = JSON.parse(storedWorkspaces);
    if (!Array.isArray(workspaces) || workspaces.length === 0) {
      setHasWorkspaces(false);
      return;
    }

    setHasWorkspaces(true);

    const storedLastWorkspace = localStorage.getItem("lastWorkspace");

    if (storedLastWorkspace) {
      try {
        const lastWorkspace = JSON.parse(storedLastWorkspace);

        const existingWorkspace = workspaces.find(
          (ws) => ws.id === lastWorkspace.id,
        );

        if (existingWorkspace) {
          const slug = lastWorkspace.slug || createSlug(existingWorkspace.name);
          router.replace(`/workspace/${slug}`);
          return;
        }
      } catch (e) {
        console.error("Error parsing lastWorkspace data", e);
      }
    }

    router.replace(`/workspace/${createSlug(workspaces[0].name)}`);
  }, [router]);

  return (
    <main className="p-6">
      <SidebarTrigger />

      {hasWorkspaces === false && (
        <div className="mt-4 text-sm text-muted-foreground">
          No workspaces found. Please create a workspace to get started.
        </div>
      )}

      {hasWorkspaces === true && (
        <div className="mt-4 text-sm text-muted-foreground">
          Redirecting to your last visited workspace...
        </div>
      )}

      {hasWorkspaces === null && (
        <div className="mt-4 text-sm text-muted-foreground">
          Checking workspaces...
        </div>
      )}
    </main>
  );
}
