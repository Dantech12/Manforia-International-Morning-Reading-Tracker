# 🚂 Manforia Reading Tracker - Railway Deployment Guide

This guide will help you deploy the Manforia Reading Tracker application to Railway, a modern platform that makes deployment simple with excellent PostgreSQL integration.

## 📋 Prerequisites

Before you begin, make sure you have:
- A GitHub account
- A Railway account (free at [railway.app](https://railway.app))
- Your project code pushed to a GitHub repository

## 🔧 Pre-Deployment Setup

### 1. Push Your Code to GitHub

1. **Initialize Git Repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Manforia Reading Tracker for Railway"
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

### 2. Environment Variables Overview

The application uses these environment variables:
- `DATABASE_URL` - Automatically provided by Railway PostgreSQL
- `SESSION_SECRET` - Secure session key (you'll set this)
- `NODE_ENV` - Set to "production"
- `PORT` - Automatically set by Railway
- `ADMIN_USERNAME` - Default: "admin"
- `ADMIN_PASSWORD` - Default: "admin123" (CHANGE THIS!)

## 🚀 Railway Deployment Steps

### Step 1: Create Railway Account & Project

1. **Sign up for Railway**:
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub (recommended for easy repository access)

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `manforia-reading-tracker` repository
   - Railway will automatically detect it's a Node.js project

### Step 2: Add PostgreSQL Database

1. **Add PostgreSQL Service**:
   - In your Railway project dashboard
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically provision a PostgreSQL database
   - The `DATABASE_URL` will be automatically available to your app

2. **Database Configuration**:
   - Railway automatically creates the database connection
   - No manual configuration needed!
   - The database URL is automatically injected as `DATABASE_URL`

### Step 3: Configure Environment Variables

1. **Access Variables Tab**:
   - In your Railway project
   - Click on your web service
   - Go to "Variables" tab

2. **Add Required Variables**:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `NODE_ENV` | `production` | Enables production optimizations |
| `SESSION_SECRET` | `[generate-secure-key]` | Use the generator below |
| `ADMIN_USERNAME` | `admin` | Or your preferred admin username |
| `ADMIN_PASSWORD` | `[secure-password]` | **CHANGE FROM DEFAULT!** |

3. **Generate Secure Session Secret**:
   ```bash
   # Run this command locally to generate a secure key
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and use it as your `SESSION_SECRET`.

### Step 4: Deploy Your Application

1. **Automatic Deployment**:
   - Railway automatically builds and deploys your app
   - It detects the Node.js project and runs:
     - `npm install` (installs dependencies)
     - `npm run build` (build step)
     - `npm run postinstall` (initializes database)
     - `npm start` (starts the server)

2. **Monitor Deployment**:
   - Watch the build logs in Railway dashboard
   - Look for "Database initialized successfully" message
   - Deployment typically takes 2-3 minutes

3. **Get Your URL**:
   - Railway provides a URL like `https://manforia-reading-tracker-production.up.railway.app`
   - Click "View Logs" to see the application starting up

## 🔐 Security Configuration

### 1. Change Default Admin Password

**CRITICAL**: Change the default admin password before going live:

1. In Railway Variables, set:
   ```
   ADMIN_PASSWORD=your-very-secure-password-here
   ```

2. Use a strong password with:
   - At least 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Not easily guessable

### 2. Secure Session Secret

Generate a cryptographically secure session secret:
```bash
# Generate 32-byte hex string
openssl rand -hex 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📊 Database Management

### Automatic Database Setup
Railway automatically:
- Creates PostgreSQL database
- Provides connection URL via `DATABASE_URL`
- Runs database initialization via `postinstall` script
- Creates tables and admin user

### Database Access
1. **Railway Dashboard**: View database metrics and connection info
2. **Direct Connection**: Use provided credentials for external tools
3. **Logs**: Monitor database queries in application logs

## 🌐 Accessing Your Application

After successful deployment:

1. **Get Your URL**: 
   - Found in Railway project dashboard
   - Format: `https://your-app-name-production.up.railway.app`

2. **Login as Admin**:
   - Username: `admin` (or your custom username)
   - Password: Your secure password

3. **Create Teachers**: 
   - Add teacher accounts through admin panel
   - Assign classes (Basic 1, Basic 2, etc.)

4. **Start Using**: 
   - Teachers can log in and submit reports
   - Admin can view all reports and export PDFs

## 🔍 Monitoring and Troubleshooting

### View Application Logs
1. Go to your Railway project dashboard
2. Click on your web service
3. Click "View Logs" to see real-time logs
4. Look for error messages or database connection issues

### Common Issues and Solutions

#### 1. Build Fails
**Error**: `npm install` or build fails
**Solutions**:
- Check `package.json` for correct dependencies
- Verify Node.js version compatibility (18+)
- Check build logs for specific error messages

#### 2. Database Connection Error
**Error**: "Database connection failed"
**Solutions**:
- Verify PostgreSQL service is running in Railway
- Check that `DATABASE_URL` is automatically set
- Look at database service logs in Railway

#### 3. Application Won't Start
**Error**: Application crashes on startup
**Solutions**:
- Check application logs for specific errors
- Verify all environment variables are set
- Ensure database initialization completed successfully

#### 4. Admin Login Issues
**Error**: Cannot login as admin
**Solutions**:
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` variables
- Check database initialization logs
- Ensure database tables were created successfully

### Debug Commands (Local Testing)

Test your configuration locally before deploying:

```bash
# Test database connection
node -e "require('./database').query('SELECT NOW()').then(r => console.log('DB OK:', r.rows[0]))"

# Initialize database manually
node init-db.js

# Check environment variables
node -e "console.log('DB URL:', process.env.DATABASE_URL ? 'Set' : 'Missing')"
```

## 🔄 Updates and Maintenance

### Automatic Deployments
- Railway automatically redeploys when you push to your main branch
- Monitor deployment status in Railway dashboard
- Rollback feature available if needed

### Database Backups
- Railway provides automatic backups for PostgreSQL
- Manual backups available through Railway dashboard
- Consider additional backup strategies for critical data

### Scaling
As your school grows:
- **Upgrade Plans**: Move from Hobby to Pro plan for better performance
- **Database Scaling**: Upgrade PostgreSQL plan for more resources
- **Monitoring**: Use Railway's built-in monitoring tools

## 💰 Railway Pricing

### Hobby Plan (Free)
- $5 credit per month (usually covers small apps)
- Automatic sleep after inactivity
- Perfect for testing and small deployments

### Pro Plan ($20/month)
- $20 credit included
- No sleeping
- Better performance and uptime
- Recommended for production use

## 🎯 Railway Advantages

### Why Railway is Great for This Project:
1. **Automatic PostgreSQL**: No manual database setup
2. **Simple Deployment**: Git-based deployments
3. **Environment Variables**: Easy configuration management
4. **Logs & Monitoring**: Built-in observability
5. **Custom Domains**: Easy to add your own domain
6. **Scaling**: Easy to upgrade as you grow

## 📞 Support Resources

### Railway Support
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord Community](https://discord.gg/railway)
- [Railway Help Center](https://help.railway.app)

### Application Support
- Check application logs in Railway dashboard
- Review this deployment guide
- Verify environment variables and database connectivity

## 🎉 Success Checklist

After deployment, verify:
- [ ] Application loads at your Railway URL
- [ ] Admin login works with your credentials
- [ ] Can create new teacher accounts
- [ ] Teachers can log in and submit reports
- [ ] Report viewing modals work correctly
- [ ] PDF export functionality works
- [ ] All pages load correctly (admin, teacher, login)
- [ ] Database is storing data properly
- [ ] No errors in Railway application logs

## 🔒 Production Security Checklist

For production use:
- [ ] Changed default admin password
- [ ] Set strong session secret
- [ ] Verified HTTPS is enabled (automatic with Railway)
- [ ] Environment variables are secure
- [ ] Database credentials are protected
- [ ] Regular monitoring is in place
- [ ] Backup strategy is implemented

## 🚀 Advanced Railway Features

### Custom Domains
1. Go to your service settings in Railway
2. Click "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

### Environment-based Deployments
- Use Railway's environment feature for staging/production
- Different databases for different environments
- Easy promotion from staging to production

### Monitoring & Alerts
- Set up monitoring for uptime and performance
- Configure alerts for errors or downtime
- Use Railway's built-in metrics dashboard

---

**Congratulations!** 🎊 Your Manforia Reading Tracker is now deployed on Railway and ready to help teachers track morning reading activities!

Railway's simplicity and powerful PostgreSQL integration make it perfect for this educational application. The automatic database provisioning and easy deployment process mean you can focus on using the app rather than managing infrastructure.

For any issues, check the Railway logs first, then refer to the troubleshooting section above.
