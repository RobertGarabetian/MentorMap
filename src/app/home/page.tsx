import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    redirect("/");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", authData.user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
  }

  return (
    <div className="flex flex-col">
      {/* <p>Hello {authData.user.email}</p>
      {profileData && (
        <div>
          <p>Community College: {profileData.community_college}</p>
          <p>Major: {profileData.college_major}</p>
        </div>
      )} */}
    </div>
  );
}
