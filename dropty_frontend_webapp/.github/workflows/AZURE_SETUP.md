# Azure Web App Deployment - Setup Guide

## 🔐 Required GitHub Secrets

You need to add the following secrets to your GitHub repository for Azure deployment:

### 1. AZURE_CREDENTIALS

This is a JSON object containing your Azure service principal credentials.

**To create Azure credentials:**

```bash
# Login to Azure CLI
az login

# Create a service principal with contributor role
az ad sp create-for-rbac --name "dropty-frontend-github-actions" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group-name} \
  --sdk-auth
```

This will output JSON like:
```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

**Copy the entire JSON output** and add it as `AZURE_CREDENTIALS` secret in GitHub.

### 2. AZURE_WEBAPP_NAME

The name of your Azure Web App (e.g., `dropty-frontend-webapp`)

### 3. AZURE_RESOURCE_GROUP

The name of your Azure Resource Group (e.g., `dropty-resources`)

---

## 📋 GitHub Secrets Summary

Add these secrets in: **Repository Settings → Secrets and variables → Actions**

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DOCKER_USERNAME` | Docker Hub username | `myusername` |
| `DOCKER_PASSWORD` | Docker Hub access token | `dckr_pat_xxxxx` |
| `AZURE_CREDENTIALS` | Azure service principal JSON | `{...}` (full JSON) |
| `AZURE_WEBAPP_NAME` | Azure Web App name | `dropty-frontend-webapp` |
| `AZURE_RESOURCE_GROUP` | Azure Resource Group name | `dropty-resources` |

---

## 🚀 How It Works

When you push to the `dev` branch, the workflow will:

1. ✅ Build Docker image
2. ✅ Run Trivy security scan
3. ✅ Push to Docker Hub with tags:
   - `{SHORT_SHA}`
   - `dev-{SHORT_SHA}`
   - `dev`
4. ✅ Login to Azure
5. ✅ Update Azure Web App container image to `dev-{SHORT_SHA}`
6. ✅ Restart Azure Web App automatically

---

## 🔧 Azure Web App Configuration

### Prerequisites

Your Azure Web App must be configured for container deployment:

1. **Create Azure Web App for Containers**:
   ```bash
   az webapp create \
     --resource-group {resource-group-name} \
     --plan {app-service-plan-name} \
     --name {webapp-name} \
     --deployment-container-image-name {docker-username}/dropty_frontend_webapp:dev
   ```

2. **Configure Docker Hub credentials in Azure**:
   ```bash
   az webapp config container set \
     --name {webapp-name} \
     --resource-group {resource-group-name} \
     --docker-registry-server-url https://index.docker.io \
     --docker-registry-server-user {docker-username} \
     --docker-registry-server-password {docker-password}
   ```

3. **Set environment variables** (if needed):
   ```bash
   az webapp config appsettings set \
     --name {webapp-name} \
     --resource-group {resource-group-name} \
     --settings \
       DB_NAME=your_db \
       DB_USER=your_user \
       DB_PASS=your_pass \
       DB_HOST=your_host \
       DB_PORT=5432
   ```

---

## ✅ Verification

After pushing to `dev` branch:

1. Check **GitHub Actions** tab - workflow should complete successfully
2. Check **Azure Portal** → Your Web App → **Deployment Center**
   - Container image should show the new tag: `dev-{SHORT_SHA}`
3. Check **Azure Portal** → Your Web App → **Overview**
   - Status should show "Running" after restart
4. Visit your web app URL to verify the deployment

---

## 🆘 Troubleshooting

### Azure Login Fails
- Verify `AZURE_CREDENTIALS` secret is valid JSON
- Check service principal has contributor role
- Ensure subscription ID is correct

### Container Image Update Fails
- Verify `AZURE_WEBAPP_NAME` matches your actual web app name
- Check Docker Hub credentials are configured in Azure Web App
- Ensure the image exists in Docker Hub

### Web App Doesn't Restart
- Verify `AZURE_RESOURCE_GROUP` is correct
- Check service principal has permissions to restart web apps
- Look at Azure Activity Log for errors

---

## 🔄 Manual Deployment

To manually trigger deployment:

1. Go to **Actions** tab in GitHub
2. Select **CI/CD Pipeline** workflow
3. Click **Run workflow**
4. Select `dev` branch
5. Click **Run workflow** button
