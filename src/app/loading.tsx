export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center pt-20">
      <div className="flex items-center gap-3 text-ink-faint">
        <span className="h-2 w-2 animate-bounce rounded-full bg-clay [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-clay [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-clay" />
      </div>
    </div>
  );
}
