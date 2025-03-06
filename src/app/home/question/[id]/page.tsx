import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch question details
  const { data: question, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !question) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/50 to-white">
      <Header user={user} />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-subtle border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2 items-center">
                {question.tag1 && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700"
                  >
                    {question.tag1}
                  </Badge>
                )}
                {question.tag2 && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-50 text-purple-700"
                  >
                    {question.tag2}
                  </Badge>
                )}
                {question.tag3 && (
                  <Badge
                    variant="secondary"
                    className="bg-amber-50 text-amber-700"
                  >
                    {question.tag3}
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {question.title}
              </h1>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{question.username}</span>
                <span className="text-xs">•</span>
                <span>Posted recently</span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {question.question}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Future: Add answers section here */}
        <div className="mt-8 text-center p-8 bg-gray-50 rounded-xl border border-gray-100">
          <h2 className="text-xl font-medium mb-2">Answers coming soon!</h2>
          <p className="text-muted-foreground">
            We&apos;re working on adding the ability for students to answer
            questions.
          </p>
        </div>
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
