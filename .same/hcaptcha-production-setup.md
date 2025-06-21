# 🔐 hCaptcha Production Setup Guide

## 📋 **Step-by-Step Process**

### **Step 1: Create hCaptcha Account**

1. **Visit hCaptcha Dashboard**: https://www.hcaptcha.com/
2. **Click "Sign Up"** in the top right corner
3. **Register** with email and password (no credit card required)
4. **Verify email** address from confirmation email

### **Step 2: Create New Site**

1. **Login** to hCaptcha dashboard: https://dashboard.hcaptcha.com/
2. **Click "+ NEW SITE"** button
3. **Fill out site details**:
   - **Site Label**: `WinningDistro Production`
   - **Hostname**: Add your production domains:
     - `same-l9mdj5nekay-latest.netlify.app`
     - `*.netlify.app` (for subdomain coverage)
     - `localhost` (for development)
     - `127.0.0.1` (for local testing)

### **Step 3: Configure Site Settings**

1. **Select hCaptcha Type**: Choose "hCaptcha" (default)
2. **Difficulty**: Select "Balanced" or "Easy" for better UX
3. **Theme**: Select "Dark" to match your site design
4. **Size**: Choose "Normal"
5. **Click "Save"**

### **Step 4: Get Your API Keys**

After saving, you'll see:
- **Site Key** (Public): Used in frontend JavaScript
- **Secret Key** (Private): Used for server-side verification

**Copy both keys** - you'll need them for the next step.

---

## 🔑 **Update Environment Variables**

Replace the test keys in your `.env` file with your real production keys:

```env
# hCaptcha Production Configuration
VITE_HCAPTCHA_SITE_KEY=your_real_site_key_here
VITE_HCAPTCHA_SECRET_KEY=your_real_secret_key_here
```

**Example**:
```env
# Replace these example keys with your actual keys from hCaptcha dashboard
VITE_HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001  # ← Replace this
VITE_HCAPTCHA_SECRET_KEY=0x0000000000000000000000000000000000000000  # ← Replace this
```

---

## 🚀 **Testing Process**

1. **Update .env file** with real keys
2. **Rebuild application**: `bun run build`
3. **Test locally**: `bun run dev`
4. **Deploy to production**: Create new version
5. **Test live site**: Visit signup page and verify captcha loads

---

## 🎯 **Expected Results**

With real production keys:
- ✅ hCaptcha script should load properly from CDN
- ✅ Captcha widget should render correctly
- ✅ Dark theme should work perfectly
- ✅ Form submission should include captcha token
- ✅ Error messages should disappear

---

## 🔧 **Domain Configuration Tips**

### **For Production**:
- Add your actual domain: `your-domain.com`
- Add Netlify domain: `your-app.netlify.app`
- Add wildcard for subdomains: `*.your-domain.com`

### **For Development**:
- Add `localhost`
- Add `127.0.0.1`
- Add local IP: `192.168.x.x` (if testing on network)

---

## 🛠️ **Troubleshooting**

### **If captcha still doesn't load**:
1. **Check browser console** for JavaScript errors
2. **Verify domain whitelist** in hCaptcha dashboard
3. **Clear browser cache** and test again
4. **Try incognito mode** to rule out extensions
5. **Test different browsers** (Chrome, Firefox, Safari)

### **Common Issues**:
- **Domain mismatch**: Ensure domain in dashboard matches exactly
- **Key typos**: Double-check site key copy/paste
- **Cache issues**: Hard refresh browser (Ctrl+Shift+R)
- **Network blocking**: Check if corporate firewall blocks hCaptcha CDN

---

## 📊 **Verification Checklist**

- [ ] hCaptcha account created
- [ ] New site configured with correct domains
- [ ] Site key and secret key copied
- [ ] `.env` file updated with real keys
- [ ] Application rebuilt and deployed
- [ ] Live site tested - captcha widget visible
- [ ] Form submission works with captcha token
- [ ] No error messages in browser console

---

## 🎉 **Success Indicators**

When working properly, you should see:
- ✅ **Captcha widget loads** instead of error message
- ✅ **Dark theme applied** matching site design
- ✅ **"I'm not a robot" checkbox** or image challenges
- ✅ **Form submits successfully** after captcha completion
- ✅ **No console errors** related to hCaptcha

---

**🚨 IMPORTANT**: Keep your secret key private! Never commit it to public repositories or client-side code.
