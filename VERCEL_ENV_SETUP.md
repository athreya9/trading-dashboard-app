# 🚀 Vercel Environment Variables Setup Guide

## 📋 Required Environment Variables

Your trading dashboard needs these environment variables to connect to Google Sheets:

### 1. GOOGLE_SHEET_ID
```
GOOGLE_SHEET_ID=1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo
```

### 2. GSHEET_CREDENTIALS
This should be your Google Service Account credentials as a JSON string:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com"
}
```

## 🔧 How to Set Up in Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Go to your Vercel project dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your `trading-dashboard-app` project

2. **Navigate to Settings**
   - Click on the "Settings" tab
   - Select "Environment Variables" from the sidebar

3. **Add GOOGLE_SHEET_ID**
   - Name: `GOOGLE_SHEET_ID`
   - Value: `1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo`
   - Environment: Select "Production", "Preview", and "Development"
   - Click "Save"

4. **Add GSHEET_CREDENTIALS**
   - Name: `GSHEET_CREDENTIALS`
   - Value: Paste your entire Google Service Account JSON (as a single line)
   - Environment: Select "Production", "Preview", and "Development"
   - Click "Save"

### Method 2: Vercel CLI

```bash
# Set GOOGLE_SHEET_ID
vercel env add GOOGLE_SHEET_ID production
# When prompted, enter: 1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo

# Set GSHEET_CREDENTIALS
vercel env add GSHEET_CREDENTIALS production
# When prompted, paste your entire Google Service Account JSON
```

## 🔑 Getting Google Service Account Credentials

If you don't have Google Service Account credentials yet:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select Project**
   - Create a new project or select existing one

3. **Enable Google Sheets API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. **Create Service Account**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and create

5. **Generate Key**
   - Click on your service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose "JSON" format
   - Download the file

6. **Share Google Sheet**
   - Open your Google Sheet
   - Click "Share"
   - Add the service account email (from the JSON file)
   - Give "Editor" permissions

## ✅ Verification

After setting up the environment variables:

1. **Redeploy your application**
   ```bash
   git push origin main
   ```

2. **Check the deployment logs**
   - Go to Vercel dashboard > Deployments
   - Click on the latest deployment
   - Check for any errors in the logs

3. **Test the API endpoints**
   - Visit: `https://your-app.vercel.app/api/data`
   - Should return Google Sheets data without errors

## 🚨 Important Notes

- **JSON Format**: The `GSHEET_CREDENTIALS` must be valid JSON on a single line
- **Private Key**: Make sure the private key includes `\n` characters for line breaks
- **Permissions**: The service account must have access to your Google Sheet
- **Security**: Never commit these credentials to your repository

## 🔄 Migration from Old Format

Your code has been updated to use the new environment variable format. The old variables (`GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_KEY`) are no longer needed and can be removed from Vercel.

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs for specific error messages
2. Verify the JSON format of your credentials
3. Ensure the service account has proper permissions
4. Test the Google Sheets API access manually