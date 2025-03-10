import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";
import PostsSection from "@/components/posts-section";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Return landing page for unauthenticated users
    console.log("not signed in");
  }

  // Fetch posts and tags for authenticated users
  const { data: posts, error: postsError } = await supabase
    .from("questions")
    .select("id, username, title, question, tag1, tag2, tag3");

  if (postsError) {
    console.error("Error fetching posts:", postsError);
    // Handle error gracefully
    return <div>Error loading questions. Please try again later.</div>;
  }

  // Fetch tags
  const { data: tags, error: tagsError } = await supabase
    .from("tags")
    .select("id, title");

  if (tagsError) {
    console.error("Error fetching tags:", tagsError);
    // Handle error gracefully
    return <div>Error loading tags. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/50 to-white">
      <Header user={user ? user : null} />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <PostsSection tags={tags || []} posts={posts || []} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 bg-white/70 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2023 MentorMap. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-900 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Help
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
