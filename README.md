# ShopifyStore_Client

React frontend for the Shopify Storefront application.

## Development

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp env.example .env
```

3. Update the `.env` file with your configuration:

   - `VITE_API_URL`: Backend API URL (default: http://localhost:5000)
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

4. Start the development server:

```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment

The built files can be deployed to any static hosting service like:

- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

Make sure to set the `VITE_API_URL` environment variable to point to your deployed backend API.
