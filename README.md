# DentAI — AI Car Damage Estimator

Snap a photo. Get a repair cost. Make money.

---

## 🚀 DEPLOYMENT — Get this LIVE in 30 minutes

### Step 1: Push to GitHub (5 min)

1. Go to github.com, sign up if needed.
2. Click **+ → New repository**. Name it `dentai`. Make it public.
3. On your computer, open the dentai folder and run:
   ```
   git init
   git add .
   git commit -m "initial"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/dentai.git
   git push -u origin main
   ```

   *No terminal? Just drag-and-drop the files into the GitHub website upload area.*

### Step 2: Get your Anthropic API key (5 min)

1. Go to **console.anthropic.com** → sign up.
2. Add a credit card and load $10 of credits (each scan costs ~$0.02).
3. **API Keys → Create Key**. Copy it. Starts with `sk-ant-`.

### Step 3: Deploy to Vercel (5 min)

1. Go to **vercel.com** → sign up with GitHub.
2. **Add New Project** → pick your `dentai` repo → **Import**.
3. Before clicking Deploy, expand **Environment Variables**:
   - Name: `ANTHROPIC_API_KEY`
   - Value: paste your `sk-ant-...` key
4. Click **Deploy**. Wait 30 seconds.
5. You'll get a URL like `dentai.vercel.app` — **your app is LIVE.**

### Step 4: Test it

1. Open your Vercel URL on your phone.
2. Click "Get my estimate" → upload a real car damage photo.
3. Watch it work.

---

## 💳 STRIPE SETUP (your parent needs to do this part)

You're 16, Stripe requires 18+. Get a parent to do these steps with you watching.

### Step 1: Create Stripe account (10 min)

1. Go to **stripe.com** → Sign up under parent's name.
2. Fill out the business info (parent's name, address, SSN — required by law for tax reporting).
3. Add your parent's bank account for payouts.

### Step 2: Create Payment Links (5 min) — EASIEST PATH

In the Stripe dashboard:

1. **Product catalog → Add product**:
   - Name: `Car Damage Scan`
   - Price: `$4.99` USD (one-time)
   - Save
2. After saving, click **Create payment link** on that product.
3. Under "After payment", set **Confirmation page → Don't show confirmation page → Redirect customers to your website**.
4. Redirect URL: `https://your-vercel-url.vercel.app?paid=true`
5. Copy the Payment Link URL.

Repeat for the **Monthly Unlimited — $9.99/mo** subscription product.

### Step 3: Wire payment links into the app

Open `index.html` and find this function:

```js
async function startAnalysis() {
```

Replace its first line with:
```js
async function startAnalysis() {
  // Redirect to Stripe before analysis
  const params = new URLSearchParams(window.location.search);
  if (params.get('paid') !== 'true') {
    const linkScan = 'YOUR_STRIPE_PAYMENT_LINK_FOR_499';
    const linkMonthly = 'YOUR_STRIPE_PAYMENT_LINK_FOR_999';
    window.location.href = selectedPlan === 'scan' ? linkScan : linkMonthly;
    return;
  }
  // ...rest of original code
```

Push to GitHub. Vercel auto-deploys. **You're now collecting real money.**

---

## 🌐 DOMAIN ($12, optional but worth it)

1. Go to **namecheap.com** → search "dentai" or "damagecost" or similar.
2. Buy the `.app` or `.com` for ~$12/year.
3. In Vercel → your project → **Settings → Domains → Add** → enter your domain.
4. Vercel tells you what DNS records to add at Namecheap. Add them. Done in 10 min.

---

## 📈 MARKETING DAY 1

- Film 1 TikTok showing the app analyzing a real dent. Caption: *"my buddy got quoted $1,800 for this — I built an app that calls bullsh*t"*
- Post in r/MechanicAdvice (subtly, in a helpful comment, not as ad)
- Cold call 5 Salem body shops with B2B pitch

---

## 💰 PROFIT TARGETS

| Volume | Revenue |
|---|---|
| 5 scans/day at $4.99 | $750/mo |
| 50 scans/day | $7,500/mo |
| + 20 monthly subs at $9.99 | +$200/mo |
| + 5 body shops at $79/mo | +$395/mo |

---

## 🆘 Need help?

Common issues:
- **"ANTHROPIC_API_KEY not configured"** → You forgot to add the env var in Vercel. Settings → Environment Variables.
- **Analysis fails** → Check Vercel function logs in dashboard.
- **Stripe link not working** → Make sure redirect URL exactly matches your Vercel URL.
