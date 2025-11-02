"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const phases = [
    { id: "legacy", title: "Legacy Chaos", text: "Infra fragmentada, deploys manuais e falta de observabilidade." },
    { id: "audit", title: "Deep Assessment", text: "Mapeamos riscos, gargalos de custo e oportunidades de automação." },
    { id: "design", title: "Cloud-Native Blueprint", text: "Arquitetura imutável, escalável e segura desenhada sob medida." },
    { id: "automate", title: "Automated Delivery", text: "Pipelines, políticas, segurança e ambiente reproduzível." },
    { id: "observability", title: "Full Observability", text: "Alertas inteligentes, métricas de performance e custo em tempo real." },
    { id: "optimize", title: "Continuous Optimization", text: "Revisões, tuning, redução de custo e melhoria constante." }
];

export default function ScrollStorytelling() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.2, 0.6]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

    return (
        <div ref={ref} className="relative z-10 py-32 px-6">
            <motion.div style={{ opacity: bgOpacity, scale }} className="absolute inset-0 bg-gradient-to-b from-dark-800/40 to-dark-900 pointer-events-none" />
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-mono font-bold text-center mb-20 text-primary"
                >
                    # Transformation Journey
                </motion.h2>
                <div className="space-y-28">
                    {phases.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="grid md:grid-cols-3 gap-10 items-start"
                        >
                            <motion.div
                                className="md:col-span-1 font-mono text-primary text-3xl font-bold"
                                whileHover={{ x: 5 }}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </motion.div>
                            <div className="md:col-span-2 bg-terminal-bg/40 backdrop-blur border border-terminal-border rounded-lg p-8 relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
                                <h3 className="text-2xl font-mono font-bold text-light mb-4">{p.title}</h3>
                                <p className="text-light/70 leading-relaxed">{p.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}