"use client";

import { Button } from "@/components/ui/button";
import { QuestionDialog } from "@/components/add-question-dialog";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Compass, UserCircle, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [username, setUsername] = useState<string>("");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        if (data) setUsername(data.username);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    getProfile();
  }, [user, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh(); // Refresh the page to update auth state
  };

  return (
    <motion.header
      className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 py-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Link href="/" className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">MentorMap</h1>
          </Link>
        </motion.div>

        <motion.div
          className="flex items-center gap-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {user && (
            <>
              <QuestionDialog user={user}>
                <Button
                  variant="outline"
                  className="rounded-full flex items-center gap-1.5 px-4 py-2 shadow-subtle text-sm font-medium transition-all hover:shadow-elevated"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Ask Question</span>
                </Button>
              </QuestionDialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full w-9 h-9 p-0 flex items-center justify-center"
                  >
                    <UserCircle className="w-5 h-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">
                      Hello, {username || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/my-questions">My Questions</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 cursor-pointer flex items-center gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {!user && (
            <Button asChild>
              <Link href="/">Sign In</Link>
            </Button>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
