import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <section className="w-full">
        {/* <SidebarTrigger /> */}
        {children}
      </section>
    </SidebarProvider>
  );
}
