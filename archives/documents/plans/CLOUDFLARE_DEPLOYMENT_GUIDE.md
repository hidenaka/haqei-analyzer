# Cloudflare Pages Deployment Guide

This document outlines the complete migration from Vercel/GitHub Pages to Cloudflare Pages for the HAQEI Analyzer project.

## Overview

All GitHub Actions workflows have been migrated to use Cloudflare Pages instead of Vercel and GitHub Pages for a simplified, unified deployment process.

## Required Secrets

The following GitHub Secrets need to be configured in your repository:

### Cloudflare Secrets
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Pages:Edit permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `CLOUDFLARE_ZONE_ID` - Zone ID for your domain (for cache purging)

### Environment Variables
- `VITE_SUPABASE_URL` - Production Supabase URL
- `VITE_SUPABASE_ANON_KEY` - Production Supabase anonymous key
- `STAGING_SUPABASE_URL` - Staging Supabase URL (optional)
- `STAGING_SUPABASE_ANON_KEY` - Staging Supabase anonymous key (optional)

### Notification (Optional)
- `SLACK_WEBHOOK` - Slack webhook URL for deployment notifications

## Workflow Structure

### 1. `deploy.yml` - Main Production Deployment
- Triggers on push to `main` branch
- Builds and deploys to Cloudflare Pages production environment
- Purges Cloudflare cache
- Runs health checks

### 2. `staging-deploy.yml` - Staging Environment
- Triggers on push to `develop` branch
- Deploys to staging environment
- Runs performance tests with Lighthouse
- Already configured for Cloudflare Pages

### 3. `production-deploy.yml` - Advanced Production Pipeline
- Comprehensive quality gates
- Security scanning
- Performance validation
- Blue-green deployment capability
- Emergency rollback procedures

### 4. `ci-cd-production.yml` - Full CI/CD Pipeline
- Security audits and CodeQL analysis
- Unit, integration, and E2E testing
- Matrix deployment strategy
- Blue-green production deployment
- Post-deployment monitoring

## Cloudflare Projects Setup

The following Cloudflare Pages projects need to be created:

1. **haqei-analyzer-production** - Main production site
2. **haqei-analyzer-staging** - Staging environment
3. **haqei-analyzer-blue** - Blue-green deployment

## Domain Configuration

Configure custom domains in Cloudflare Pages:

- **Production**: `haqei.com`, `www.haqei.com`
- **Staging**: `staging.haqei.com`
- **Blue**: `blue.haqei.com`

## Local Development

### Build Commands
```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Local development with wrangler
npm run wrangler:dev

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

### Wrangler Configuration

The `wrangler.toml` file is configured with:
- Multiple environments (production, staging, blue)
- Route configurations for custom domains
- Build settings

## Migration Checklist

- [x] Updated `deploy.yml` to use Cloudflare Pages
- [x] Updated `production-deploy.yml` with Cloudflare deployment
- [x] Updated `ci-cd-production.yml` for Cloudflare
- [x] Added wrangler dependency to package.json
- [x] Updated deployment scripts
- [x] Created comprehensive wrangler.toml configuration
- [ ] Set up Cloudflare Pages projects
- [ ] Configure GitHub Secrets
- [ ] Set up custom domains in Cloudflare
- [ ] Test deployment workflows

## Key Changes from Vercel

1. **Deployment Action**: Changed from `amondnet/vercel-action` to `cloudflare/pages-action@v1`
2. **Configuration**: Uses `wrangler.toml` instead of Vercel project settings
3. **Environment Variables**: Managed through GitHub Secrets and wrangler config
4. **Cache Management**: Direct Cloudflare API calls for cache purging
5. **Rollback**: Uses wrangler commands instead of Vercel API

## Benefits of Cloudflare Pages

1. **Performance**: Global CDN with edge computing capabilities
2. **Cost**: More predictable pricing structure
3. **Integration**: Native integration with Cloudflare security features
4. **Reliability**: Enterprise-grade infrastructure
5. **Simplicity**: Single platform for hosting and CDN

## Troubleshooting

### Common Issues

1. **API Token Permissions**: Ensure the Cloudflare API token has `Pages:Edit` permissions
2. **Domain Verification**: Verify custom domains are properly configured in Cloudflare
3. **Build Failures**: Check that the `dist` directory exists after npm build
4. **Environment Variables**: Ensure all required secrets are set in GitHub

### Support

For issues with this deployment setup, check:
1. GitHub Actions logs
2. Cloudflare Pages deployment logs
3. Wrangler CLI documentation
4. Cloudflare Pages documentation

## Security Considerations

- API tokens are stored as GitHub Secrets
- Environment variables are injected at build time
- Cache purging requires Zone ID for security
- Health checks verify deployment success

## Next Steps

1. Set up Cloudflare Pages projects
2. Configure GitHub repository secrets
3. Test the deployment workflows
4. Monitor performance metrics
5. Set up alerting for failed deployments