"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const tags = [
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "tailwind", label: "Tailwind CSS" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "api", label: "API" },
]

export function QuestionDialog() {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [question, setQuestion] = React.useState("")
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log({ title, question, selectedTags })
    setOpen(false)
  }

  const toggleTag = (tagValue: string) => {
    setSelectedTags((prev) => (prev.includes(tagValue) ? prev.filter((t) => t !== tagValue) : [...prev, tagValue]))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Ask a Question</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ask a Question</DialogTitle>
            <DialogDescription>Create your question and add relevant tags to help others find it.</DialogDescription>
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
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    )}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <p className="text-sm text-muted-foreground">Selected tags: {selectedTags.length}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!title || !question || selectedTags.length === 0}>
              Submit Question
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

