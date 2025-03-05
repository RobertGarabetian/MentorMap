import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { QuestionDialog } from "@/components/add-question-dialog";
import PostsSection from "@/components/posts-section";

export default async function PrivatePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    redirect("/");
  }

  const { data: posts, error: postError } = await supabase
    .from("questions")
    .select("id, username, title, question, tag1, tag2, tag3");

  if (postError) {
    throw postError;
  }

  const { data: tags, error: tagError } = await supabase
    .from("tags")
    .select("id, title");

  if (tagError) {
    throw postError;
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      {/* Header Section */}
      <div className="text-center mb-8 mt-4">
        <h1 className="text-4xl font-bold tracking-tight mb-2">MentorMap</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Get advice from students who&apos;ve been there
        </p>
        <QuestionDialog user={user} />
      </div>

      <PostsSection tags={tags} posts={posts} />
    </main>
  );
}
