// SignOutButton.jsx
"use client";

import { LogOut } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { signOut } from "./actions";

export function SignOutButton() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <button onClick={signOut}>
          <LogOut />
          <span>Log Out</span>
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
