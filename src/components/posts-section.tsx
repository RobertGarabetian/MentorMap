"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Tag {
  id: number;
  title: string;
}
interface Post {
  id: number;
  username: string;
  title: string;
  question: string;
  tag1: string;
  tag2: string;
  tag3: string;
}

interface PostsSectionProps {
  tags: Tag[];
  posts: Post[];
}

const PostsSection: React.FC<PostsSectionProps> = ({ tags, posts }) => {
  const [selectedTag, setSelectedTag] = useState("all");

  const filteredPosts =
    selectedTag === "all"
      ? posts
      : posts.filter(
          (post) =>
            post.tag1 === selectedTag ||
            post.tag2 === selectedTag ||
            post.tag3 === selectedTag
        );

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Select
          defaultValue="all"
          onValueChange={(value) => setSelectedTag(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Questions</SelectItem>
            {tags && tags.length > 0 ? (
              tags.map((tagItem) => (
                <SelectItem key={tagItem.id} value={tagItem.title}>
                  {tagItem.title}
                </SelectItem>
              ))
            ) : (
              <p>No tags</p>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Questions Feed */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription>
                      Posted by: {post.username}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {post.tag1 && (
                      <Badge variant="secondary">{post.tag1}</Badge>
                    )}
                    {post.tag2 && (
                      <Badge variant="secondary">{post.tag2}</Badge>
                    )}
                    {post.tag3 && (
                      <Badge variant="secondary">{post.tag3}</Badge>
                    )}
                  </div>
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
      </div>
    </div>
  );
};

export default PostsSection;
