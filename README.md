# SV3 Computer — Laptop Store Demo

A frontend-only Angular and TypeScript e-commerce midterm project for **SV3 Computer**, a fictional laptop shop in Phnom Penh. The starter includes twenty sample laptops (eight per catalog page, with Next and Show all controls), bilingual Khmer/English UI, USD/KHR display, a browser-persisted cart, demo checkout, and a printable HTML invoice. No real payment or order service is connected.

## Requirements

- Node.js compatible with Angular 21 (use an active LTS release; Angular's current installation guide lists Node.js v22.22.3 or newer)
- npm

## Run locally

```bash
npm install
npm start
```

Open the local address printed by Angular CLI. The development server reloads the app as you edit it. Create an optimized production build with:

```bash
npm run build
```

The site is a client-rendered single-page application. For this demo, CSR is the practical choice: the cart, language, and checkout are browser-specific, and there is no product API that needs server rendering. SSR would add server hosting for little benefit here. SSG/prerendering is a reasonable later option if the team wants build-time HTML for each public product page; the product list is currently sample data in TypeScript.

## Project structure

```text
src/app/
  data/products.ts                 # twenty sample laptop records
  models/product.ts                # product, cart, language, currency types
  services/catalog.service.ts      # sample catalog lookup
  services/cart.service.ts         # cart state and LocalStorage persistence
  services/preferences.service.ts  # Khmer/English, USD/KHR display
  pages/catalog/                   # search, category filters, product cards
  pages/product-detail/            # product specs and add-to-cart action
  pages/cart/                      # quantities, removal, subtotal
  pages/checkout/                  # validated demo checkout form
  pages/invoice/                   # printable invoice from the last demo order
  app.routes.ts                    # lazy-loaded page routes
  app.component.ts                 # shared header, preferences, footer
```

## Feature notes

- **Cart:** saved under `sv3-cart-v1` in browser LocalStorage. It persists on that device and is not synchronized between customers or browsers.
- **Currency:** KHR is shown using a fixed classroom-demo rate of **1 USD = 4,100 KHR**. It is not a live exchange rate.
- **Checkout:** validates contact and delivery fields, then creates a local demo invoice. It does not accept payment or send an order to a shop.
- **Invoice:** visit `/invoice` after completing checkout and use **Print invoice** to print or save to PDF.
- **Product photos:** loaded from Unsplash, so an internet connection is needed for photos.

## Static hosting

Build with `npm run build` and publish the generated `dist/sv3-computer-store/browser/` folder. The included `public/_redirects` and `vercel.json` send client-side routes back to `index.html`, so refreshing a detail page works on Netlify or Vercel. For another static host, configure an equivalent single-page-app fallback. See [Angular deployment](https://angular.dev/tools/cli/deployment).

GitHub Pages can host a static build, but project-site URLs include the repository name. Set the Angular base href to `/<repository-name>/` for that build, and configure a Pages-compatible route fallback (or choose hash routing). Do not commit generated `dist/` output unless the class specifically requires it.

## Suggested group responsibilities

For a team of four:

1. **Catalog and product data:** maintain the ten product records, cards, search, category filters, and detail page.
2. **Cart and preferences:** implement LocalStorage behavior, quantities, currency display, and language toggle.
3. **Checkout and invoice:** build the form, validation, order summary, and print stylesheet.
4. **Integration and documentation:** review visual consistency and accessibility, connect routes, keep the README and public GitHub repository organized, and coordinate the final presentation.

For smaller teams, combine roles 1 and 4 or roles 2 and 3. Everyone should review the complete flow before the presentation.

## Public GitHub repository guidance

1. Create a new **public** repository for the class project on GitHub.
2. From this folder, initialize Git if needed, commit the starter, add the repository as `origin`, then push the default branch.
3. Keep `node_modules/` and `dist/` out of Git; the included `.gitignore` handles both.
4. Add each teammate as a collaborator and record their work in commits or the project board.
5. Put the hosted demo URL and team names in this README after your team chooses and configures hosting.

Do not put passwords, API keys, or private customer data in the public repository. This demo uses sample products and does not need secrets.
