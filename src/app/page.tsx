"use client";

import { motion } from "framer-motion";

export default function Home() {
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
  ];

  const techStack = [
    "Kubernetes", "Docker", "Terraform", "AWS", "Azure", "Jenkins",
    "GitLab", "Prometheus", "Grafana", "ELK Stack", "Ansible", "Helm"
  ];

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
  ];

  return (
    <div className="min-h-screen bg-dark font-roboto text-light overflow-hidden">
      {/* Minimal Background - Jobs Style */}
      <div className="fixed inset-0 bg-gradient-to-br from-dark via-dark-800 to-dark-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 p-6"
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            className="text-2xl font-mono font-bold text-primary"
            whileHover={{ scale: 1.05 }}
          >
            [ávila@ops ~]$
          </motion.div>

          <div className="hidden md:flex space-x-8">
            {["Serviços", "Stack", "Cases", "Contato"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-light/80 hover:text-primary transition-colors font-mono"
                whileHover={{ y: -2 }}
              >
                ./{item.toLowerCase()}
              </motion.a>
            ))}
          </div>

          <motion.button
            className="bg-terminal-bg border border-primary px-6 py-2 rounded font-mono text-primary hover:bg-primary hover:text-terminal-bg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ./contact.sh
          </motion.button>
        </nav>
      </motion.header>

      {/* Hero Section - Ultra Minimal Style */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
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
              className="text-7xl md:text-9xl font-mono font-bold mb-12 leading-tight tracking-tight"
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
              className="text-2xl md:text-4xl text-light/60 mb-16 font-light max-w-4xl mx-auto"
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
                className="bg-primary text-dark px-16 py-6 rounded-lg font-mono font-bold text-xl hover:shadow-2xl hover:shadow-primary/50 transition-all"
              >
                Start Transformation
              </motion.button>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="mt-20 text-light/30 text-sm font-mono flex flex-col items-center gap-3"
              >
                <span>Scroll to explore</span>
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

      {/* Resultados */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-mono font-bold text-center mb-16 text-primary"
          >
            # Resultados Comprovados
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center bg-terminal-bg/50 backdrop-blur-sm border border-terminal-border p-8 rounded-lg hover:border-primary transition-all"
                whileHover={{ scale: 1.05, borderColor: "#10B981" }}
              >
                <div className="text-4xl mb-4">{result.icon}</div>
                <div className="text-3xl md:text-4xl font-mono font-bold text-primary mb-2">
                  {result.metric}
                </div>
                <div className="text-light/60 font-mono text-sm">{result.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-mono font-bold text-center mb-16 text-primary"
          >
            # Core Services
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-terminal-bg/50 backdrop-blur-sm border border-terminal-border p-8 rounded-lg hover:border-primary transition-all group"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="text-6xl mb-6">{service.icon}</div>
                <h3 className="text-2xl font-mono font-bold text-light mb-4">
                  {service.name}
                </h3>
                <p className="text-light/60 mb-6 leading-relaxed">{service.description}</p>

                <div className="space-y-2">
                  {service.stack.map((tech, techIndex) => (
                    <motion.span
                      key={techIndex}
                      className="inline-block bg-primary/20 text-primary px-3 py-1 rounded font-mono text-sm mr-2 mb-2"
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
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 bg-terminal-bg border border-terminal-border rounded hover:border-primary transition-all group cursor-pointer"
                  whileHover={{ scale: 1.05, y: -3 }}
                >
                  <span className="font-mono text-light group-hover:text-primary transition-colors">
                    {tech}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cases */}
      <section id="cases" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-mono font-bold text-center mb-16 text-primary"
          >
            # Success Cases
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {cases.map((caseStudy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-terminal-bg/50 backdrop-blur-sm border border-terminal-border p-8 rounded-lg hover:border-primary transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-mono font-bold text-primary mb-4">
                  {caseStudy.company}
                </h3>
                <div className="space-y-4 font-mono text-sm">
                  <div>
                    <span className="text-light/60">Challenge:</span>
                    <br />
                    <span className="text-light">{caseStudy.challenge}</span>
                  </div>
                  <div>
                    <span className="text-light/60">Solution:</span>
                    <br />
                    <span className="text-primary">{caseStudy.solution}</span>
                  </div>
                  <div>
                    <span className="text-light/60">Result:</span>
                    <br />
                    <span className="text-light font-semibold">{caseStudy.result}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
