# 🚀 Manforia Reading Tracker - Render Deployment Guide

This guide will help you deploy the Manforia Reading Tracker application to Render, a modern cloud platform that makes deployment simple and reliable.

## 📋 Prerequisites

Before you begin, make sure you have:
- A GitHub account
- A Render account (free at [render.com](https://render.com))
- Your project code pushed to a GitHub repository

## 🔧 Pre-Deployment Setup

### 1. Push Your Code to GitHub

1. **Initialize Git Repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Manforia Reading Tracker"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com](https://github.com) and create a new repository
   - Name it something like `manforia-reading-tracker`
   - Don't initialize with README (since you already have code)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/manforia-reading-tracker.git
   git branch -M main
   git push -u origin main
   ```

### 2. Environment Variables Setup

The application uses these environment variables:
- `DATABASE_URL` - Automatically provided by Render PostgreSQL
- `SESSION_SECRET` - Automatically generated secure key
- `NODE_ENV` - Set to "production"
- `PORT` - Automatically set by Render
- `ADMIN_USERNAME` - Default: "admin"
- `ADMIN_PASSWORD` - Default: "admin123" (change this!)

## 🚀 Deployment Steps

### Method 1: Using render.yaml (Recommended)

1. **Connect GitHub to Render**:
   - Log in to [render.com](https://render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub account if not already connected
   - Select your repository

2. **Configure Blueprint**:
   - Render will detect the `render.yaml` file
   - Review the configuration:
     - Web Service: `manforia-reading-tracker`
     - Database: `manforia-reading-db` (PostgreSQL)
   - Click "Apply"

3. **Wait for Deployment**:
   - Render will automatically:
     - Create the PostgreSQL database
     - Install dependencies (`npm install`)
     - Initialize the database (`npm run postinstall`)
     - Start the application (`npm start`)

### Method 2: Manual Setup

If you prefer manual setup:

#### Step 1: Create PostgreSQL Database

1. In Render Dashboard, click "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `manforia-reading-db`
   - **Database**: `manforia_reading_tracker`
   - **User**: `manforia_user`
   - **Plan**: Free
3. Click "Create Database"
4. **Copy the Database URL** from the database info page

#### Step 2: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `manforia-reading-tracker`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### Step 3: Set Environment Variables

In the web service settings, add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | *Paste the PostgreSQL URL from Step 1* |
| `SESSION_SECRET` | *Generate a random 32+ character string* |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `your-secure-password` |

## 🔐 Security Configuration

### 1. Change Default Admin Password

**IMPORTANT**: Change the default admin password before deployment:

1. In your environment variables, set:
   ```
   ADMIN_PASSWORD=your-very-secure-password-here
   ```

2. Or update it in the `render.yaml` file:
   ```yaml
   - key: ADMIN_PASSWORD
     value: your-very-secure-password-here
   ```

### 2. Generate Secure Session Secret

For production, generate a strong session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use this value for the `SESSION_SECRET` environment variable.

## 📊 Database Initialization

The application automatically initializes the PostgreSQL database with:
- **Tables**: `teachers`, `daily_reports`, `weekly_reports`
- **Admin User**: Created with your specified credentials
- **Indexes**: For optimal performance

This happens automatically via the `postinstall` script in `package.json`.

## 🌐 Accessing Your Application

After successful deployment:

1. **Get Your URL**: Render provides a URL like `https://manforia-reading-tracker.onrender.com`
2. **Login as Admin**:
   - Username: `admin` (or your custom username)
   - Password: Your secure password
3. **Create Teachers**: Add teacher accounts through the admin panel
4. **Start Using**: Teachers can now log in and submit reports!

## 🔍 Monitoring and Logs

### View Application Logs
1. Go to your web service in Render Dashboard
2. Click on "Logs" tab
3. Monitor for any errors or issues

### Database Management
1. Access your PostgreSQL database through Render's web interface
2. Use the provided connection details for external database tools
3. Monitor database usage in the database dashboard

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. Build Fails
**Error**: `npm install` fails
**Solution**: 
- Check `package.json` for correct dependencies
- Ensure Node.js version compatibility (18+)

#### 2. Database Connection Error
**Error**: "Database connection failed"
**Solution**:
- Verify `DATABASE_URL` environment variable
- Check database is running and accessible
- Ensure database credentials are correct

#### 3. Application Won't Start
**Error**: Application crashes on startup
**Solution**:
- Check logs for specific error messages
- Verify all environment variables are set
- Ensure `PORT` is not hardcoded (Render sets this automatically)

#### 4. Login Issues
**Error**: Cannot login as admin
**Solution**:
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables
- Check database initialization logs
- Try recreating the admin user

### Debug Commands

If you need to debug, you can run these commands locally:

```bash
# Test database connection
node -e "require('./database').query('SELECT NOW()').then(r => console.log('DB OK:', r.rows[0]))"

# Initialize database manually
node init-db.js

# Check environment variables
node -e "console.log(process.env)"
```

## 🔄 Updates and Maintenance

### Deploying Updates
1. Push changes to your GitHub repository
2. Render automatically redeploys on new commits to main branch
3. Monitor deployment logs for any issues

### Database Backups
- Render Free PostgreSQL includes automatic backups
- For additional backup strategies, consider:
  - Regular database exports
  - External backup services
  - Database replication for critical data

### Scaling
As your school grows:
- **Upgrade Plans**: Move from Free to Starter/Pro plans for better performance
- **Database Scaling**: Upgrade PostgreSQL plan for more storage/connections
- **Monitoring**: Add application monitoring tools

## 📞 Support

### Render Support
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Render Status Page](https://status.render.com)

### Application Support
- Check application logs in Render Dashboard
- Review this deployment guide
- Verify environment variables and database connectivity

## 🎉 Success Checklist

After deployment, verify:
- [ ] Application loads at your Render URL
- [ ] Admin login works with your credentials
- [ ] Can create new teacher accounts
- [ ] Teachers can log in and submit reports
- [ ] PDF export functionality works
- [ ] All pages load correctly (admin, teacher, login)
- [ ] Database is storing data properly
- [ ] No errors in application logs

## 🔒 Production Security Notes

For production use, consider:
1. **Strong Passwords**: Use complex passwords for all accounts
2. **HTTPS**: Render provides HTTPS automatically
3. **Environment Variables**: Never commit secrets to Git
4. **Database Security**: Use strong database passwords
5. **Regular Updates**: Keep dependencies updated
6. **Monitoring**: Set up alerts for application errors
7. **Backups**: Implement regular backup procedures

---

**Congratulations!** 🎊 Your Manforia Reading Tracker is now live and ready to help teachers track morning reading activities!

For any issues or questions, refer to the troubleshooting section above or check the Render documentation.
