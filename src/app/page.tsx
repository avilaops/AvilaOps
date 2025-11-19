"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InteractiveTerminal from "./components/InteractiveTerminal";
import LiveMetricsDashboard from "./components/LiveMetricsDashboard";
import ScrollStorytelling from "./components/ScrollStorytelling";
import InteractiveCases from "./components/InteractiveCases";

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const services = [
        {
            icon: "⚙️",
            name: "DevOps Engineering",
            description: "CI/CD pipelines, automation e Infrastructure as Code",
            stack: ["Kubernetes", "Docker", "Jenkins", "GitLab CI"]
        },
        {
            icon: "☁️",
            name: "Cloud Architecture",
            description: "Design e implementação de infraestrutura escalável",
            stack: ["AWS", "Azure", "GCP", "Terraform"]
        },
        {
            icon: "🔒",
            name: "Security Operations",
            description: "DevSecOps, compliance e monitoramento avançado",
            stack: ["SIEM", "SOC", "Compliance", "Zero Trust"]
        }
    ];

    const results = [
        { metric: "99.9%", label: "Uptime SLA", icon: "📈" },
        { metric: "60%", label: "Deploy Speed", icon: "🚀" },
        { metric: "50%", label: "Cost Reduction", icon: "💰" },
        { metric: "24/7", label: "Support", icon: "👁️" }
    ].map(r => ({ ...r, key: `result-${r.metric}-${r.label.replaceAll(' ', '-')}` }));

    const techStack = [
        "Kubernetes", "Docker", "Terraform", "AWS", "Azure", "Jenkins",
        "GitLab", "Prometheus", "Grafana", "ELK Stack", "Ansible", "Helm"
    ].map(t => ({ name: t, key: `tech-${t.toLowerCase().replaceAll(' ', '-')}` }));

    const cases = [
        {
            company: "Cliente Enterprise",
            challenge: "Migração para cloud Azure",
            solution: "Kubernetes + Azure AKS + Terraform",
            result: "Deploy automatizado em 10min vs 2h manual"
        },
        {
            company: "Startup SaaS",
            challenge: "Escalabilidade automática",
            solution: "Auto-scaling + CI/CD + Monitoring",
            result: "Suportou crescimento de 1000% sem downtime"
        },
        {
            company: "E-commerce",
            challenge: "Performance Black Friday",
            solution: "Load Balancing + CDN + Cache Redis",
            result: "Zero downtime em pico de 50x tráfego"
        }
    ].map(c => ({ ...c, key: `case-${c.company.toLowerCase().replaceAll(' ', '-')}` }));

    return (
        <div className="min-h-screen bg-dark font-roboto text-light overflow-x-hidden">
            {/* Minimal Background - Jobs Style */}
            <div className="fixed inset-0 bg-gradient-to-br from-dark via-dark-800 to-dark-900">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-delayed" />
                </div>
            </div>

            {/* Header */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-50 p-4 md:p-6"
            >
                <nav className="max-w-7xl mx-auto flex items-center justify-between">
                    <motion.div
                        className="text-xl md:text-2xl font-mono font-bold text-primary"
                        whileHover={{ scale: 1.05 }}
                    >
                        [ávila@ops ~]$
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                        {["Serviços", "Stack", "Cases", "Contato"].map((item) => (
                            <motion.a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-light/80 hover:text-primary transition-colors font-mono text-sm"
                                whileHover={{ y: -2 }}
                            >
                                ./{item.toLowerCase()}
                            </motion.a>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <motion.button
                        className="hidden md:block bg-terminal-bg border border-primary px-6 py-2 rounded font-mono text-primary hover:bg-primary hover:text-terminal-bg transition-all text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        ./contact.sh
                    </motion.button>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Toggle menu"
                    >
                        <motion.span
                            animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                            className="w-6 h-0.5 bg-primary transition-all"
                        />
                        <motion.span
                            animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="w-6 h-0.5 bg-primary transition-all"
                        />
                        <motion.span
                            animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                            className="w-6 h-0.5 bg-primary transition-all"
                        />
                    </motion.button>
                </nav>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden bg-dark-800/95 backdrop-blur-lg border-t border-primary/20 mt-4"
                        >
                            <div className="max-w-7xl mx-auto py-4 px-4 space-y-3">
                                {["Serviços", "Stack", "Cases", "Contato"].map((item) => (
                                    <motion.a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        className="block text-light/80 hover:text-primary transition-colors font-mono text-base py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                        whileTap={{ x: 10 }}
                                    >
                                        ./{item.toLowerCase()}
                                    </motion.a>
                                ))}
                                <motion.button
                                    className="w-full bg-terminal-bg border border-primary px-6 py-3 rounded font-mono text-primary hover:bg-primary hover:text-terminal-bg transition-all text-sm mt-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ./contact.sh
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Hero Section - Ultra Minimal Style */}
            <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 sm:py-0">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Single Powerful Message */}
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-mono font-bold mb-8 sm:mb-12 leading-tight tracking-tight"
                        >
                            <span className="text-light">Infrastructure</span>
                            <br />
                            <span className="text-primary">That Scales</span>
                        </motion.h1>

                        {/* Minimal Subtext */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-light/60 mb-10 sm:mb-16 font-light max-w-4xl mx-auto px-4"
                        >
                            From chaos to cloud-native.
                            <br />
                            <span className="text-light/40">In weeks, not years.</span>
                        </motion.p>

                        {/* Single Clear CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-primary text-dark px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6 rounded-lg font-mono font-bold text-base sm:text-lg md:text-xl hover:shadow-2xl hover:shadow-primary/50 transition-all"
                            >
                                Start Transformation
                            </motion.button>

                            {/* Scroll Indicator */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2, duration: 1 }}
                                className="mt-12 sm:mt-16 md:mt-20 text-light/30 text-sm font-mono flex flex-col items-center gap-3"
                            >
                                <span className="hidden sm:inline">Scroll to explore</span>
                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-2xl"
                                >
                                    ↓
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Interactive Terminal MVP */}
            <InteractiveTerminal
                services={services.map(s => ({ name: s.name, description: s.description }))}
                stack={techStack.map(t => t.name)}
                cases={cases.map(c => ({ company: c.company, challenge: c.challenge, solution: c.solution, result: c.result }))}
            />

            {/* Live Metrics Dashboard */}
            <LiveMetricsDashboard />

            {/* Resultados */}
            <section className="relative z-10 py-12 sm:py-16 md:py-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-center mb-10 sm:mb-12 md:mb-16 text-primary"
                    >
                        # Resultados Comprovados
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
                    >
                        {results.map((result, index) => (
                            <motion.div
                                key={result.key}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="text-center bg-terminal-bg/50 backdrop-blur-sm border border-terminal-border p-4 sm:p-6 md:p-8 rounded-lg hover:border-primary transition-all"
                                whileHover={{ scale: 1.05, borderColor: "#10B981" }}
                            >
                                <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4">{result.icon}</div>
                                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono font-bold text-primary mb-1 sm:mb-2">
                                    {result.metric}
                                </div>
                                <div className="text-light/60 font-mono text-xs sm:text-sm">{result.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Serviços */}
            <section id="servicos" className="relative z-10 py-12 sm:py-16 md:py-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-center mb-10 sm:mb-12 md:mb-16 text-primary"
                    >
                        # Core Services
                    </motion.h2>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={`service-${service.name.toLowerCase().replaceAll(' ', '-')}`}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-terminal-bg/50 backdrop-blur-sm border border-terminal-border p-6 sm:p-8 rounded-lg hover:border-primary transition-all group"
                                whileHover={{ scale: 1.02, y: -5 }}
                            >
                                <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">{service.icon}</div>
                                <h3 className="text-xl sm:text-2xl font-mono font-bold text-light mb-3 sm:mb-4">
                                    {service.name}
                                </h3>
                                <p className="text-sm sm:text-base text-light/60 mb-4 sm:mb-6 leading-relaxed">{service.description}</p>

                                <div className="space-y-2">
                                    {service.stack.map((tech) => (
                                        <motion.span
                                            key={`service-${service.name}-${tech.toLowerCase().replaceAll(' ', '-')}`}
                                            className="inline-block bg-primary/20 text-primary px-2 sm:px-3 py-1 rounded font-mono text-xs sm:text-sm mr-2 mb-2"
                                            whileHover={{ scale: 1.1, backgroundColor: "rgba(16,185,129,0.3)" }}
                                        >
                                            {tech}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scroll Storytelling */}
            <ScrollStorytelling />

            {/* Tech Stack */}
            <section id="stack" className="relative z-10 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-mono font-bold text-center mb-16 text-primary"
                    >
                        # Technology Stack
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-terminal-bg/50 backdrop-blur-sm border border-terminal-border rounded-lg p-8"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {techStack.map((tech, index) => (
                                <motion.div
                                    key={tech.key}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center p-4 bg-terminal-bg border border-terminal-border rounded hover:border-primary transition-all group cursor-pointer"
                                    whileHover={{ scale: 1.05, y: -3 }}
                                >
                                    <span className="font-mono text-light group-hover:text-primary transition-colors">
                                        {tech.name}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Cases Interativos */}
            <InteractiveCases
                cases={cases.map(c => ({
                    company: c.company,
                    challenge: c.challenge,
                    solution: c.solution,
                    result: c.result,
                    layers: [
                        "Ingress / CDN", "Gateway / LB", "Service Mesh", "Microservices", "CI/CD Pipeline", "Observability Stack"
                    ]
                }))}
            />

            {/* Footer */}
            <footer className="relative z-10 py-12 px-6 border-t border-terminal-border">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl font-mono font-bold text-primary mb-4"
                    >
                        [ávila@ops ~]$ exit
                    </motion.div>
                    <p className="text-light/60 font-mono mb-8">
                        # Infrastructure that scales, technology that transforms
                    </p>
                    <div className="flex justify-center space-x-6 font-mono">
                        <motion.a
                            href="#"
                            className="text-light/60 hover:text-primary transition-colors"
                            whileHover={{ y: -3 }}
                        >
                            ./linkedin
                        </motion.a>
                        <motion.a
                            href="#"
                            className="text-light/60 hover:text-primary transition-colors"
                            whileHover={{ y: -3 }}
                        >
                            ./github
                        </motion.a>
                        <motion.a
                            href="#"
                            className="text-light/60 hover:text-primary transition-colors"
                            whileHover={{ y: -3 }}
                        >
                            ./contact
                        </motion.a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
