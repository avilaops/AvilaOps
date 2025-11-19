# Security Policy

## 🔒 Reporting a Vulnerability

If you discover a security vulnerability, please send an email to:

**security@avilaops.com**

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## ⏱️ Response Time

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Depends on severity (critical: 1-7 days, high: 7-14 days)

## 🛡️ Security Measures

Our application implements:

- Rate limiting (20 req/min)
- Input validation & sanitization
- XSS protection
- Security headers (HSTS, CSP, X-Frame-Options)
- Environment variable protection
- Dependency security audits

## 🔐 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| < 0.2   | :x:                |

## 📋 Security Best Practices

When contributing:

1. Never commit secrets (.env files)
2. Use parameterized queries
3. Validate all user inputs
4. Follow OWASP guidelines
5. Keep dependencies updated

## 🚨 Known Security Considerations

- API rate limiting is IP-based (can be bypassed with proxies)
- Session data stored in MongoDB (ensure proper access controls)
- OpenAI API key must be kept secure

## 📞 Contact

- Security Email: security@avilaops.com
- General Contact: contato@avilaops.com

Thank you for helping keep AvilaOps secure! 🛡️
