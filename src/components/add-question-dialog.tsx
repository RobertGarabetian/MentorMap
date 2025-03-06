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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { type User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { AlertCircle, X, Plus, Check } from "lucide-react";

const tags = [
  { value: "Transfer Essays", label: "Transfer Essays" },
  { value: "Internships", label: "Internships" },
  { value: "Classes", label: "Classes" },
  { value: "Transfer Classes", label: "Transfer Classes" },
];

interface QuestionDialogProps {
  user: User | null;
  children?: React.ReactNode;
}

export function QuestionDialog({ user, children }: QuestionDialogProps) {
  const supabase = createClient();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [uuid, setUuid] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [username, setUsername] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState({
    title: "",
    question: "",
    tags: "",
  });

  const getProfile = React.useCallback(async () => {
    if (!user) return;

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
        console.error(profileError);
        throw profileError;
      }

      if (profileData) {
        setUuid(profileData.user_id);
        setUsername(profileData.username);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (open) {
      getProfile();
    }
  }, [open, getProfile]);

  const validate = () => {
    const errors = {
      title: "",
      question: "",
      tags: "",
    };

    if (!title.trim()) {
      errors.title = "Title is required";
    } else if (title.length < 5) {
      errors.title = "Title must be at least 5 characters";
    }

    if (!question.trim()) {
      errors.question = "Question details are required";
    } else if (question.length < 20) {
      errors.question = "Please provide more details (at least 20 characters)";
    }

    if (selectedTags.length === 0) {
      errors.tags = "Please select at least one tag";
    }

    setValidationErrors(errors);
    return !errors.title && !errors.question && !errors.tags;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("questions").insert({
        user_id: uuid,
        username: username,
        title: title,
        question: question,
        tag1: selectedTags[0] || null,
        tag2: selectedTags[1] || null,
        tag3: selectedTags[2] || null,
      });

      if (error) throw error;

      // Reset form
      setTitle("");
      setQuestion("");
      setSelectedTags([]);
      setOpen(false);

      // Refresh the page to show the new question
      window.location.reload();
    } catch (error) {
      console.error("Error posting question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tagValue: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagValue)) {
        return prev.filter((t) => t !== tagValue);
      } else if (prev.length < 3) {
        return [...prev, tagValue];
      } else {
        return prev;
      }
    });
  };

  const renderValidationError = (message: string) => {
    return message ? (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-red-500 flex items-center gap-1.5 mt-1.5"
      >
        <AlertCircle className="h-3.5 w-3.5" />
        <span>{message}</span>
      </motion.div>
    ) : null;
  };

  const closeDialog = () => {
    setOpen(false);
    // Reset form
    setTitle("");
    setQuestion("");
    setSelectedTags([]);
    setValidationErrors({
      title: "",
      question: "",
      tags: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            className="rounded-full flex items-center gap-1.5 px-4 py-2 shadow-subtle"
          >
            <Plus className="h-4 w-4" />
            <span>Ask a Question</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white/95 backdrop-blur-md shadow-floating border-gray-100">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">Ask a Question</DialogTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={closeDialog}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <DialogDescription className="text-base text-muted-foreground mt-2">
              Create your question and add relevant tags to help others find it.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Question Title
              </Label>
              <Input
                id="title"
                placeholder="What's your question about?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={cn(
                  "bg-white/70 border-gray-200 focus-visible:ring-primary",
                  validationErrors.title &&
                    "border-red-300 focus-visible:ring-red-500"
                )}
              />
              {renderValidationError(validationErrors.title)}
            </div>

            <div className="space-y-2">
              <Label htmlFor="question" className="text-sm font-medium">
                Question Details
              </Label>
              <Textarea
                id="question"
                placeholder="Provide more details about your question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={cn(
                  "min-h-[150px] bg-white/70 border-gray-200 focus-visible:ring-primary",
                  validationErrors.question &&
                    "border-red-300 focus-visible:ring-red-500"
                )}
              />
              {renderValidationError(validationErrors.question)}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Tags (Select up to 3)
                </Label>
                <span className="text-xs text-muted-foreground">
                  {selectedTags.length}/3 selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.value);
                  return (
                    <TooltipProvider key={tag.value}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => toggleTag(tag.value)}
                            className={cn(
                              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all focus:outline-none",
                              isSelected
                                ? "bg-primary text-white hover:bg-primary/90"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}
                          >
                            {isSelected ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Plus className="h-3.5 w-3.5" />
                            )}
                            {tag.label}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isSelected ? "Remove tag" : "Add tag"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>

              {renderValidationError(validationErrors.tags)}

              <AnimatePresence>
                {selectedTags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-gray-100"
                  >
                    <p className="text-sm">Selected tags:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="bg-white px-3 py-1 text-sm gap-1.5 border-gray-200"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className="text-muted-foreground hover:text-foreground ml-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 bg-gray-50/80 border-t border-gray-100">
            <div className="flex justify-between items-center w-full gap-4">
              <p className="text-xs text-muted-foreground">
                All fields marked are required
              </p>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !title ||
                  !question ||
                  selectedTags.length === 0
                }
                className={cn(
                  "rounded-full px-6",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? "Submitting..." : "Submit Question"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
