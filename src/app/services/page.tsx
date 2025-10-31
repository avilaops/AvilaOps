"use client";

import { motion } from "framer-motion";

export default function ServicesPage() {
  const serviceDetails = [
    {
      icon: "⚙️",
      name: "DevOps Engineering",
      description: "Transformamos sua infraestrutura com automação completa e pipelines CI/CD de última geração",
      features: [
        "Pipeline CI/CD automatizado",
        "Infrastructure as Code (IaC)",
        "Containerização com Docker/Kubernetes",
        "Monitoramento e observabilidade",
        "GitOps e versionamento de infra"
      ],
      technologies: ["Jenkins", "GitLab CI", "GitHub Actions", "Terraform", "Ansible", "Helm"],
      deliverables: [
        "Pipeline completo configurado",
        "Documentação técnica detalhada",
        "Treinamento da equipe",
        "Suporte 24/7 por 3 meses"
      ]
    },
    {
      icon: "☁️",
      name: "Cloud Architecture",
      description: "Projetamos e implementamos arquiteturas cloud escaláveis, seguras e cost-effective",
      features: [
        "Multi-cloud strategy",
        "Auto-scaling inteligente",
        "Disaster recovery automatizado",
        "Otimização de custos",
        "Compliance e segurança"
      ],
      technologies: ["AWS", "Azure", "GCP", "CloudFormation", "ARM Templates", "CDK"],
      deliverables: [
        "Arquitetura cloud completa",
        "Migração sem downtime",
        "Otimização de custos 40%+",
        "Documentação de arquitetura"
      ]
    },
    {
      icon: "🔒",
      name: "Security Operations",
      description: "Implementamos DevSecOps com segurança integrada em todo o ciclo de desenvolvimento",
      features: [
        "SIEM e SOC automatizado",
        "Vulnerability scanning",
        "Compliance automation",
        "Zero Trust Architecture",
        "Incident response automation"
      ],
      technologies: ["Splunk", "ELK Stack", "Vault", "Falco", "OPA", "Istio"],
      deliverables: [
        "SOC completo configurado",
        "Políticas de segurança",
        "Compliance reports",
        "Incident response playbook"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-dark font-roboto text-light overflow-hidden">
      {/* Matrix Background */}
      <div className="fixed inset-0 bg-gradient-terminal">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.1),transparent)]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 p-6"
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.a
            href="/"
            className="text-2xl font-mono font-bold text-primary"
            whileHover={{ scale: 1.05 }}
          >
            [ávila@ops ~]$
          </motion.a>
        </nav>
      </motion.header>

      {/* Hero */}
      <section className="relative z-10 pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-mono font-bold mb-8"
          >
            <span className="text-primary"># Core Services</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-light/80 max-w-4xl mx-auto mb-16 font-mono"
          >
            $ cat /etc/avilaops/mission.txt <br />
            {`> Transformamos infraestrutura legacy em arquiteturas cloud-native escaláveis`}
          </motion.p>
        </div>
      </section>

      {/* Services Detailed */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          {serviceDetails.map((service) => (
            <motion.div
              key={`service-detail-${service.name.toLowerCase().replaceAll(' ', '-')}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-start"
            >
              {/* Service Info */}
              <div className={serviceDetails.indexOf(service) % 2 === 1 ? "md:order-2" : ""}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-6xl">{service.icon}</div>
                  <div>
                    <h2 className="text-3xl font-mono font-bold text-primary">{service.name}</h2>
                  </div>
                </div>

                <p className="text-light/80 text-lg mb-8 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-mono font-bold text-primary mb-4">{`// Features`}</h3>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={`feature-${service.name}-${feature.substring(0, 20).toLowerCase().replaceAll(' ', '-')}`} className="flex items-center gap-3 text-light/70">
                          <span className="text-primary">{'>'}</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-mono font-bold text-primary mb-4">{`// Deliverables`}</h3>
                    <ul className="space-y-2">
                      {service.deliverables.map((deliverable) => (
                        <li key={`deliverable-${service.name}-${deliverable.substring(0, 20).toLowerCase().replaceAll(' ', '-')}`} className="flex items-center gap-3 text-light/70">
                          <span className="text-secondary">✓</span>
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className={serviceDetails.indexOf(service) % 2 === 1 ? "md:order-1" : ""}>
                <div className="bg-terminal-bg/50 backdrop-blur-sm border border-terminal-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-terminal-text/60 font-mono">tech-stack.sh</span>
                  </div>

                  <div className="font-mono text-sm">
                    <div className="text-primary mb-2">$ ./list-technologies.sh</div>
                    <div className="text-secondary mb-4">Loading tech stack...</div>

                    <div className="grid grid-cols-2 gap-3">
                      {service.technologies.map((tech) => (
                        <motion.div
                          key={`tech-${service.name}-${tech.toLowerCase().replaceAll(' ', '-')}`}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: service.technologies.indexOf(tech) * 0.1 }}
                          className="bg-terminal-bg border border-primary/30 rounded px-3 py-2 text-center hover:border-primary transition-colors"
                        >
                          <span className="text-light">{tech}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="text-primary mt-4">{`$ echo "Ready for deployment"`}</div>
                    <div className="text-light/60">Ready for deployment ✓</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="relative z-10 py-20 px-6 bg-terminal-bg/20">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-mono font-bold text-center mb-16 text-primary"
          >
            # Nossa Metodologia
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                command: "assess",
                title: "Assessment",
                description: "Auditoria completa da infraestrutura atual",
                activities: ["Infrastructure audit", "Security assessment", "Performance analysis", "Cost optimization"]
              },
              {
                step: "02",
                command: "design",
                title: "Design",
                description: "Arquitetura otimizada para suas necessidades",
                activities: ["Architecture design", "Technology selection", "Migration strategy", "Risk assessment"]
              },
              {
                step: "03",
                command: "implement",
                title: "Implementation",
                description: "Implementação com zero downtime",
                activities: ["Phased migration", "Testing automation", "Monitoring setup", "Team training"]
              },
              {
                step: "04",
                command: "optimize",
                title: "Optimization",
                description: "Melhoria contínua e suporte 24/7",
                activities: ["Performance tuning", "Cost optimization", "Security hardening", "Incident response"]
              }
            ].map((phase) => (
              <motion.div
                key={`phase-${phase.command}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Number.parseInt(phase.step) * 0.15 }}
                className="bg-terminal-bg/50 backdrop-blur-sm border border-terminal-border p-6 rounded-lg"
              >
                <div className="font-mono text-primary text-3xl font-bold mb-2">{phase.step}</div>
                <div className="font-mono text-secondary mb-3">$ ./avilaops --{phase.command}</div>
                <h3 className="text-xl font-mono font-bold text-light mb-3">{phase.title}</h3>
                <p className="text-light/70 mb-4 text-sm">{phase.description}</p>
                <ul className="space-y-1 text-xs text-light/60">
                  {phase.activities.map((activity) => (
                    <li key={`activity-${phase.command}-${activity.substring(0, 15).toLowerCase().replaceAll(' ', '-')}`} className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      {activity}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-terminal-bg/50 backdrop-blur-sm border border-primary rounded-lg p-12 text-center"
          >
            <div className="font-mono text-primary text-lg mb-4">$ ./start-transformation.sh</div>
            <h2 className="text-3xl font-mono font-bold text-light mb-6">
              Ready to Transform Your Infrastructure?
            </h2>
            <p className="text-light/80 mb-8">
              Entre em contato para uma consultoria gratuita e veja como podemos
              otimizar sua infraestrutura para máxima performance e eficiência.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-primary text-dark px-8 py-3 rounded font-mono font-semibold hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ./schedule-consultation
              </motion.button>
              <motion.button
                className="bg-terminal-bg border border-primary text-primary px-8 py-3 rounded font-mono font-semibold hover:bg-primary hover:text-dark transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ./view-case-studies
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-terminal-border">
        <div className="max-w-7xl mx-auto text-center">
          <motion.a
            href="/"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-mono font-bold text-primary mb-4 inline-block"
          >
            [ávila@ops ~]$ exit
          </motion.a>
          <p className="text-light/60 font-mono">
            # Infrastructure that scales, technology that transforms
          </p>
        </div>
      </footer>
    </div>
  );
}