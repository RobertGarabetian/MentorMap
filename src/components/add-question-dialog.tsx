"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { type User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

const tags = [
  { value: "Transfer Essays", label: "Transfer Essays" },
  { value: "Internships", label: "Internships" },
  { value: "Classes", label: "Classes" },
  { value: "Transfer Classes", label: "Transfer Classes" },
];

export function QuestionDialog({ user }: { user: User | null }) {
  const supabase = createClient();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [uuid, setUuid] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [username, setUsername] = React.useState(true);

  const getProfile = React.useCallback(async () => {
    try {
      const {
        data: profileData,
        error: profileError,
        status,
      } = await supabase
        .from("profiles")
        .select("user_id, username")
        .eq("user_id", user?.id)
        .single();

      if (profileError && status !== 406) {
        console.log(profileError);
        throw profileError;
      }

      if (profileData) {
        setUuid(profileData.user_id);
        setUsername(profileData.username);
      }
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    } finally {
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ title, question, selectedTags });
    try {
      const { error } = await supabase.from("questions").insert({
        user_id: uuid,
        username: username,
        title: title,
        question: question,
        tag1: selectedTags[0],
        tag2: selectedTags[1],
        tag3: selectedTags[2],
      });
      if (error) throw error;
      alert("Question uploaded to database");
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
    }

    setOpen(false);
  };

  const toggleTag = (tagValue: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagValue)
        ? prev.filter((t) => t !== tagValue)
        : [...prev, tagValue]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Ask a Question</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ask a Question</DialogTitle>
            <DialogDescription>
              Create your question and add relevant tags to help others find it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Question Title</Label>
              <Input
                id="title"
                placeholder="What's your question about?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="question">Question Details</Label>
              <Textarea
                id="question"
                placeholder="Provide more details about your question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => toggleTag(tag.value)}
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      selectedTags.includes(tag.value)
                        ? "bg-primary text-primary-foreground hover:bg-primary/80"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Selected tags: {selectedTags.length}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!title || !question || selectedTags.length === 0}
            >
              Submit Question
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
