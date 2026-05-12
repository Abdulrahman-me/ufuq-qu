interface AppShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-black text-foreground md:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-sm text-muted-foreground md:text-base">
              {subtitle}
            </p>
          ) : null}
        </header>
        {children}
      </div>
    </div>
  );
}
