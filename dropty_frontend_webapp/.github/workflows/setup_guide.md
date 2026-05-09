# GitHub Actions CI/CD - Quick Setup Guide

## 🚀 Quick Start

### 1. Push Workflows to GitHub
```bash
git add .github/workflows/
git commit -m "Add GitHub Actions CI/CD pipeline"
git push origin dev
```

### 2. Verify in GitHub
- Go to your repository → **Actions** tab
- Workflow will run automatically
- Check for successful completion

---

## 🔐 GitHub Secrets (Required)

### For Docker Hub

Your workflow uses Docker Hub for container images. Add these secrets:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub access token |

**To create a Docker Hub access token:**
1. Login to Docker Hub
2. Go to Account Settings → Security
3. Click **New Access Token**
4. Copy the token and use it as `DOCKER_PASSWORD`

### For Azure Web App Deployment

To enable automatic Azure deployment, add these additional secrets:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `AZURE_CREDENTIALS` | Azure service principal JSON (see AZURE_SETUP.md) |
| `AZURE_WEBAPP_NAME` | Your Azure Web App name |
| `AZURE_RESOURCE_GROUP` | Your Azure Resource Group name |

**See [AZURE_SETUP.md](AZURE_SETUP.md) for detailed Azure configuration instructions.**

---

## 📦 Using Docker Images

### Pull from Docker Hub
```bash
# Login to Docker Hub
docker login

# Pull the latest dev image
docker pull YOUR_USERNAME/dropty_frontend_webapp:dev

# Or pull a specific version
docker pull YOUR_USERNAME/dropty_frontend_webapp:dev-abc1234

# Run the container
docker run -p 80:80 \
  -e DB_NAME=dropty_db \
  -e DB_USER=postgres \
  -e DB_PASS=your_password \
  -e DB_HOST=your_db_host \
  -e DB_PORT=5432 \
  YOUR_USERNAME/dropty_frontend_webapp:dev
```

---

## 🎯 Workflow Triggers

### CI/CD Pipeline
- ✅ Push to `dev` branch
- ✅ Manual trigger (Actions tab → CI/CD Pipeline → Run workflow)

---

## 📋 Checklist

- [ ] Add Docker Hub secrets (`DOCKER_USERNAME`, `DOCKER_PASSWORD`)
- [ ] Add Azure secrets (`AZURE_CREDENTIALS`, `AZURE_WEBAPP_NAME`, `AZURE_RESOURCE_GROUP`)
- [ ] Push workflow files to GitHub
- [ ] Check Actions tab to verify workflow runs
- [ ] Verify Docker image pushed to Docker Hub
- [ ] Verify Azure Web App updated with new image

---

## 🆘 Troubleshooting

### Workflow Fails
- Check the Actions tab for error details
- Common issues: ESLint errors, TypeScript errors, build failures
- Fix locally first: `npm run lint && npm run build`

### Docker Build/Push Fails
- Verify Docker Hub credentials are correct
- Check Docker build logs in Actions tab
- Ensure Dockerfile builds locally: `docker build -t test .`
- Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets are set

### Azure Deployment Fails
- Check `AZURE_CREDENTIALS` is valid JSON
- Verify `AZURE_WEBAPP_NAME` and `AZURE_RESOURCE_GROUP` are correct
- See [AZURE_SETUP.md](AZURE_SETUP.md) for detailed troubleshooting

### Can't Pull Docker Image
- Verify you're logged into Docker Hub: `docker login`
- Check image exists: visit `https://hub.docker.com/r/YOUR_USERNAME/dropty_frontend_webapp`
- Ensure image was pushed successfully in Actions tab
