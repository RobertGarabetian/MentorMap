import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Compass } from "lucide-react";
import Link from "next/link";

interface AuthContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthContainer({
  children,
  title,
  subtitle,
}: AuthContainerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md animate-fade-in shadow-elevated border border-gray-100">
        <div className="text-center pt-8 pb-4">
          <div className="inline-flex items-center justify-center">
            <Compass className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold">
              <Link href="/">MentorMap</Link>
            </h1>
          </div>
          <h2 className="text-xl font-semibold mt-4">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <CardContent className="pb-8">{children}</CardContent>
      </Card>
    </div>
  );
}
