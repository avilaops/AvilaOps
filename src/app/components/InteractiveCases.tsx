"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface CaseItem {
    company: string;
    challenge: string;
    solution: string;
    result: string;
    layers: string[]; // camadas da arquitetura
}

interface InteractiveCasesProps {
    cases: CaseItem[];
}

export default function InteractiveCases({ cases }: InteractiveCasesProps) {
    const [active, setActive] = useState<string | null>(null);
    return (
        <div className="relative z-10 py-20 px-6" id="cases">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-mono font-bold text-center mb-16 text-primary"
                >
                    # Success Cases
                </motion.h2>
                <div className="grid md:grid-cols-3 gap-10">
                    {cases.map((c, i) => (
                        <motion.div
                            key={`case-int-${c.company.toLowerCase().replaceAll(' ', '-')}`}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            onMouseEnter={() => setActive(c.company)}
                            onMouseLeave={() => setActive(prev => prev === c.company ? null : prev)}
                            className="relative bg-terminal-bg/50 backdrop-blur-sm border border-terminal-border rounded-lg p-6 overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors" />
                            <h3 className="text-xl font-mono font-bold text-primary mb-4">{c.company}</h3>
                            <p className="text-light/70 text-sm mb-4"><span className="text-light/50">Challenge:</span> {c.challenge}</p>
                            <p className="text-light/70 text-sm mb-4"><span className="text-light/50">Solution:</span> <span className="text-primary">{c.solution}</span></p>
                            <p className="text-light/70 text-sm mb-6"><span className="text-light/50">Result:</span> <span className="text-light font-semibold">{c.result}</span></p>

                            <div className="h-32 relative">
                                {c.layers.map((layer, li) => (
                                    <motion.div
                                        key={`layer-${c.company}-${layer.toLowerCase().replaceAll(' ', '-')}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: active === c.company ? 1 : 0.15, y: active === c.company ? 0 : 10 }}
                                        transition={{ delay: active === c.company ? li * 0.08 : 0 }}
                                        className="absolute left-0 right-0 mx-auto border border-primary/30 rounded px-3 py-1 text-center text-[11px] font-mono"
                                        style={{ top: li * 22, background: "rgba(16,185,129,0.05)" }}
                                    >
                                        {layer}
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-4 text-[10px] text-light/40 font-mono">Hover para ver camadas de arquitetura</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}