# Socks website design

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/alis-projects-babca186/v0-socks-website-design)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/lcIFUNWo6oc)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/alis-projects-babca186/v0-socks-website-design](https://vercel.com/alis-projects-babca186/v0-socks-website-design)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/lcIFUNWo6oc](https://v0.app/chat/lcIFUNWo6oc)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Seller storage

The storefront renders seller content from RustFS using its S3-compatible API. Set
`SELLER_ROOT_DOMAIN` to the shared domain (defaults to `sockseller.com`) and
`SELLER_BUCKET` to the default bucket (defaults to `joorabmoon`). A host such as
`joorabmoon.sockseller.com` automatically selects the `joorabmoon` bucket.

Configure `RUSTFS_ENDPOINT`, `RUSTFS_ACCESS_KEY_ID`, `RUSTFS_SECRET_ACCESS_KEY`,
and optionally `RUSTFS_REGION` (default `us-east-1`). Upload image files (`jpg`,
`jpeg`, `png`, `webp`, `gif`, or `avif`) to each bucket. RustFS signed URLs are
generated server-side for the storefront. The filename becomes the product name,
and an optional `content.json` file can customize the seller:

```json
{
  "name": "Joorabmoon",
  "tagline": "Step into color",
  "description": "A short seller description.",
  "products": [
    {
      "name": "Midnight Pattern",
      "description": "A product description.",
      "price": 24.99,
      "colors": ["Black", "Navy"]
    }
  ]
}
```
