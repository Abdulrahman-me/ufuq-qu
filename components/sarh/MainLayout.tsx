import AppSidebar from "@/components/sarh/AppSidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 mr-0 ml-16">
        {children}
      </main>
    </div>
  );
}
