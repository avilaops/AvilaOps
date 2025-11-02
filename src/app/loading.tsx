export default function Loading() {
    return (
        <div className="min-h-screen bg-dark flex items-center justify-center">
            <div className="text-center">
                {/* Terminal-style loading */}
                <div className="font-mono text-primary text-xl mb-6 animate-pulse">
                    [loading...]
                </div>

                {/* Animated dots */}
                <div className="flex gap-2 justify-center">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-3 h-3 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    ))}
                </div>

                {/* Progress bar */}
                <div className="mt-8 w-64 h-1 bg-dark-800 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]" />
                </div>

                <p className="mt-6 text-light/40 text-sm font-mono">
                    Inicializando sistema...
                </p>
            </div>
        </div>
    );
}