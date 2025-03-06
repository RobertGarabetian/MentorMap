"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUp, User } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest"); // latest or popular
  const router = useRouter();

  // Apply all filters: tag filter, search filter, and sort
  const filteredAndSortedPosts = posts
    .filter((post) => {
      // First apply tag filter
      const passesTagFilter =
        selectedTag === "all" ||
        post.tag1 === selectedTag ||
        post.tag2 === selectedTag ||
        post.tag3 === selectedTag;

      // Then apply search filter
      const passesSearchFilter =
        searchTerm === "" ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.question.toLowerCase().includes(searchTerm.toLowerCase());

      return passesTagFilter && passesSearchFilter;
    })
    // Then apply sorting
    .sort((a, b) => {
      // This is a placeholder - in a real app, you'd have timestamps
      // and other metrics to sort by
      if (sortBy === "latest") {
        return b.id - a.id; // Newer posts have higher IDs
      } else {
        return a.id - b.id; // Just a placeholder for popularity
      }
    });

  // Animation variants for staggered card entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <motion.div
        className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-subtle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white border-gray-200 focus-visible:ring-primary"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative w-full md:w-[180px]">
              <Select
                defaultValue="all"
                onValueChange={(value) => setSelectedTag(value)}
              >
                <SelectTrigger className="w-full bg-white border-gray-200">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter by type" />
                  </div>
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

            <div className="relative w-full md:w-[180px]">
              <Select
                defaultValue="latest"
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger className="w-full bg-white border-gray-200">
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {selectedTag !== "all" && (
            <Badge variant="outline" className="bg-white/80 px-3 py-1 gap-1.5">
              {selectedTag}
              <button
                onClick={() => setSelectedTag("all")}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="outline" className="bg-white/80 px-3 py-1 gap-1.5">
              &quot;{searchTerm}&quot;
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Results summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedPosts.length} question
          {filteredAndSortedPosts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Questions Feed */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {filteredAndSortedPosts.length > 0 ? (
          filteredAndSortedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={cardVariants}
              custom={index}
              layout
            >
              <Card
                onClick={() => {
                  router.push(`/home/question/${post.id}`);
                }}
                className="overflow-hidden transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 cursor-pointer border-gray-100 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-medium leading-tight">
                        {post.title}
                      </CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center justify-end">
                      {post.tag1 && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          {post.tag1}
                        </Badge>
                      )}
                      {post.tag2 && (
                        <Badge
                          variant="secondary"
                          className="bg-purple-50 text-purple-700 hover:bg-purple-100"
                        >
                          {post.tag2}
                        </Badge>
                      )}
                      {post.tag3 && (
                        <Badge
                          variant="secondary"
                          className="bg-amber-50 text-amber-700 hover:bg-amber-100"
                        >
                          {post.tag3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.question}
                  </p>
                </CardContent>
                <CardFooter className="pt-2 pb-4 flex justify-between items-center border-t border-gray-100 mt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{post.username}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {/* Placeholder - in real app would show date/time */}
                    Posted recently
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="py-12 text-center"
          >
            <div className="mx-auto flex flex-col items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No questions found</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                Try adjusting your search or filter to find what you&apos;re
                looking for.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
export default PostsSection;
