"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ResponseFormProps {
  questionId: number;
  questionOwnerId: string;
}

export default function ResponseForm({
  questionId,
  questionOwnerId,
}: ResponseFormProps) {
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!responseText.trim()) {
      console.log("ERROR RESPONSE CANNOT BE EMPTY");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log("nobody signed in");
        return;
      }

      // Insert response into database
      const { error } = await supabase.from("responses").insert({
        question_id: questionId,
        responder_id: user.id,
        question_owner_id: questionOwnerId,
        response_text: responseText,
      });

      if (error) {
        throw error;
      }

      // Success
      console.log("success");

      // Clear form and refresh page
      setResponseText("");
      router.refresh();
    } catch (error) {
      console.error("Error submitting response:", error);
      console.log("error submitting");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
    >
      <h3 className="text-xl font-semibold mb-4">Add Your Response</h3>

      <Textarea
        value={responseText}
        onChange={(e) => setResponseText(e.target.value)}
        placeholder="Share your answer or advice..."
        className="min-h-32 mb-4 focus-visible:ring-primary"
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !responseText.trim()}
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Submit Response"}
        </Button>
      </div>
    </form>
  );
}
