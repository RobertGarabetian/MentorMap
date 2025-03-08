import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";

interface Response {
  id: number;
  question_id: number;
  responder_id: string;
  response_text: string;
  created_at: string;
  // Added for display purposes - will be populated from the join query
  username?: string;
}

interface ResponseListProps {
  responses: Response[];
}

export default function ResponseList({ responses }: ResponseListProps) {
  if (!responses.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-muted-foreground">
          No responses yet. Be the first to respond!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Responses ({responses.length})</h2>

      {responses.map((response) => (
        <div
          key={response.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
        >
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{response.username || "Anonymous"}</span>
            <span className="text-xs">•</span>
            <span>
              {response.created_at
                ? formatDistanceToNow(new Date(response.created_at), {
                    addSuffix: true,
                  })
                : "Recently"}
            </span>
          </div>

          <div className="text-gray-800 whitespace-pre-wrap">
            {response.response_text}
          </div>
        </div>
      ))}
    </div>
  );
}
