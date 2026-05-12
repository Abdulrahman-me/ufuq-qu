export default function ChapterLoading() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[55%] space-y-4">
          <div className="h-64 rounded-xl bg-muted" />
          <div className="h-24 rounded-xl bg-muted" />
        </div>
        <div className="lg:w-[45%] h-96 rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
