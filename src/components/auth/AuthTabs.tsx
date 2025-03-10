import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { AuthContainer } from "./auth-container";

export function AuthTabs() {
  return (
    <AuthContainer
      title="Welcome to MentorMap"
      subtitle="Connect with mentors and peers to guide your academic journey"
    >
      <Tabs defaultValue="signup" className="w-full">
        <TabsList className="auth-tabs-list mb-6 w-full">
          <TabsTrigger value="signup" className="auth-tabs-trigger w-full">
            Sign Up
          </TabsTrigger>
          <TabsTrigger value="login" className="auth-tabs-trigger w-full">
            Log In
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="p-0 space-y-4">
          <LoginForm />
        </TabsContent>

        <TabsContent value="signup" className="p-0 space-y-4">
          <SignupForm />
        </TabsContent>
      </Tabs>
    </AuthContainer>
  );
}
