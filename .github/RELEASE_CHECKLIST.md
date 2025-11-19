# Release Checklist

Use this checklist when preparing a new release.

## Pre-Release

### Documentation
- [ ] Update CHANGELOG.md with all changes
- [ ] Update version in package.json
- [ ] Review and update README.md if needed
- [ ] Check all documentation is up to date
- [ ] Update API documentation if applicable

### Code Quality
- [ ] All tests pass locally
- [ ] No linting errors (`npm run lint`)
- [ ] Code is formatted (`npm run format` if available)
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Build succeeds (`npm run build`)
- [ ] Production build works locally (`npm start`)

### GitHub
- [ ] All CI checks passing on main branch
- [ ] No open critical/high priority issues blocking release
- [ ] All PRs for this release are merged
- [ ] Branch is up to date with main

## Release Process

### Version Bump
```bash
# For patch release (0.3.0 -> 0.3.1)
npm version patch

# For minor release (0.3.0 -> 0.4.0)
npm version minor

# For major release (0.3.0 -> 1.0.0)
npm version major
```

### Git
- [ ] Commit version bump
- [ ] Create git tag: `git tag -a v0.X.0 -m "Release v0.X.0"`
- [ ] Push commits: `git push origin main`
- [ ] Push tags: `git push origin --tags`

### GitHub Release
- [ ] Go to [Releases](https://github.com/avilaops/AvilaOps/releases)
- [ ] Click "Draft a new release"
- [ ] Select the version tag
- [ ] Set release title: `v0.X.0 - Release Name`
- [ ] Copy relevant section from CHANGELOG.md
- [ ] Attach any necessary assets
- [ ] Check "Create a discussion for this release"
- [ ] Publish release

### Post-Release
- [ ] Verify deployment succeeded
- [ ] Check GitHub Pages is updated
- [ ] Test live site: https://avilaops.github.io/AvilaOps
- [ ] Announce release on social media (if applicable)
- [ ] Update project board/milestones
- [ ] Close related issues and PRs
- [ ] Create next milestone (if needed)

## Rollback Plan

If issues are discovered after release:

1. **Hot Fix**
   ```bash
   git checkout main
   git checkout -b hotfix/issue-name
   # Make fixes
   git commit -m "fix: critical issue"
   git push origin hotfix/issue-name
   # Create PR and merge
   ```

2. **Revert Release**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

3. **Delete Tag** (if necessary)
   ```bash
   git tag -d v0.X.0
   git push origin :refs/tags/v0.X.0
   ```

## Version Numbering Guide

### Semantic Versioning (MAJOR.MINOR.PATCH)

- **MAJOR** (1.0.0): Breaking changes, major features
- **MINOR** (0.1.0): New features, backwards compatible
- **PATCH** (0.0.1): Bug fixes, small improvements

### Examples

```
0.1.0 -> 0.1.1  (Bug fix)
0.1.1 -> 0.2.0  (New feature)
0.9.9 -> 1.0.0  (Major release with breaking changes)
```

## Communication Template

### GitHub Release Notes Template

```markdown
## 🚀 What's New

- Feature 1
- Feature 2

## 🐛 Bug Fixes

- Fix 1
- Fix 2

## 📚 Documentation

- Updated docs

## ⚠️ Breaking Changes

- Change 1 (if any)

## 🙏 Contributors

Thanks to all contributors who made this release possible!

## 📦 Installation

\`\`\`bash
git clone https://github.com/avilaops/AvilaOps.git
cd AvilaOps
npm install
\`\`\`

Full changelog: [v0.X.0...v0.Y.0](link)
```

## Notes

- Always test in a staging environment first
- Keep main branch stable and releasable
- Use feature flags for incomplete features
- Document breaking changes clearly
- Maintain backwards compatibility when possible

---

**Last Updated**: 2025-11-19
