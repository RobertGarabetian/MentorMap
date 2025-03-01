import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import { QuestionDialog } from "@/components/add-question-dialog";

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
  return (
    <main className="container mx-auto p-4 max-w-4xl">
      {/* Header Section */}
      <div className="text-center mb-8 mt-4">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          College Connect
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Get advice from students who&apos;ve been there
        </p>
        {/* <Button size="lg" className="gap-2">
          <PlusCircle className="w-5 h-5" />
          Ask a Question
        </Button> */}
        <div>{user?.email}</div>
        <QuestionDialog user={user} />
      </div>

      {/* Filter Section */}
      <div className="flex items-center gap-4 mb-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Questions</SelectItem>
            <SelectItem value="transfer">Transfer Advice</SelectItem>
            <SelectItem value="career">Career Guidance</SelectItem>
            <SelectItem value="classes">Classes & Majors</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Questions Feed */}
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription>Posted by {post.username}</CardDescription>
                  </div>

                  {post.tag1 && <Badge variant="secondary">{post.tag1}</Badge>}
                  {post.tag2 && <Badge variant="secondary">{post.tag2}</Badge>}
                  {post.tag3 && <Badge variant="secondary">{post.tag3}</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{post.question}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No questions found.</p>
        )}
        {/* <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">
                  How do I transfer to UC Berkeley as a CS major?
                </CardTitle>
                <CardDescription>
                  Posted by Sarah M. • 2 hours ago
                </CardDescription>
              </div>
              <Badge variant="secondary">Transfer</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              I&apos;m currently in my first semester at Sacramento City College
              and I&apos;m planning to transfer to UC Berkeley. What
              prerequisites should I focus on? Any advice from successful
              transfers?
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-1">
                <ThumbsUp className="w-4 h-4" />
                24
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <MessageCircle className="w-4 h-4" />
                12 Replies
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </main>
  );
}
