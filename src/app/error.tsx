'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to Application Insights
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-6xl mb-6"
                >
                    💥
                </motion.div>

                <h2 className="text-3xl font-mono font-bold text-primary mb-4">
                    # Error 500
                </h2>

                <p className="text-light/60 mb-2 font-mono text-sm">
                    {error.message || 'Algo deu errado!'}
                </p>

                {error.digest && (
                    <p className="text-light/40 mb-6 font-mono text-xs">
                        Error ID: {error.digest}
                    </p>
                )}

                <div className="space-y-3">
                    <motion.button
                        onClick={reset}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-primary text-dark px-6 py-3 rounded-lg font-mono font-bold hover:shadow-lg hover:shadow-primary/50 transition-all"
                    >
                        ./retry.sh
                    </motion.button>

                    <motion.a
                        href="/"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="block w-full bg-terminal-bg border border-primary text-primary px-6 py-3 rounded-lg font-mono font-bold hover:bg-primary hover:text-terminal-bg transition-all"
                    >
                        ./home.sh
                    </motion.a>
                </div>

                <p className="mt-8 text-light/30 text-xs font-mono">
                    Se o problema persistir, entre em contato.
                </p>
            </motion.div>
        </div>
    );
}
