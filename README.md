# BAMBU ecommerce demo

A mobile-first concept for Madtech Solutions' bamboo tableware client. BAMBU is temporary branding. Products, pricing, sizes, material storytelling, and generated imagery are illustrative.

## Run

Use Node.js 20+ and npm:

```sh
npm install
npm run dev
npm run build
```

Storefront: `/`. Admin: `/#admin`. Both are part of the same responsive app.

This implementation uses React, TypeScript, Vite, Lucide icons, custom responsive CSS and native CSS/SVG animations. Cart, inventory, orders, and expenses persist in localStorage in the same browser. No account, backend, payment gateway, email, delivery integration, or cross-device synchronization is connected. Admin access is intentionally open inside this demo; production requires authentication and server authorization. Sample checkout details only.

## Client walkthrough

1. Browse and filter the six sample products. Open a product and add packs to the bag.
2. Explore the bamboo material journey (scroll or tap stages), switch table settings, and drag or use the slider on the interactive product illustration.
3. Complete the clearly labelled demo checkout. An order is created and inventory is reduced.
4. Open the admin studio, update order status, edit product prices or stock, and add an expense.
5. Reload to demonstrate browser persistence. A new browser starts with the original sample catalogue and no transactions.

Sales include delivery charges. Sales less recorded expenses is displayed as a simple balance, not profit. Stock is counted in packs.

## Verification

TypeScript check and Vite production build. Browser walkthrough at 390px: cart, checkout, order confirmation, order status, stock deduction, and expense recording. Tablet and mobile visual checks. Reduced-motion styles and keyboard modal focus trapping are included.

## Image provenance

Product cards, product detail panels, cart, admin thumbnails, hero, and table-setting scenes use locally optimized supplier reference photography. See design/PHOTO-SOURCES.md for source credits and replacement requirements. Some pictured products are reusable; sample catalogue specifications are illustrative. The material journey retains intentional graphic bamboo illustrations.

The original generated hero is retained in design/bamboo-editorial-source.png for history and is no longer displayed.

## Local environment

The host's npm shim was broken and the network install stalled. This checkout currently reuses the existing project's installed dependencies through an ignored local node_modules junction. The package manifest and lockfile are provided for a normal independent installation elsewhere.

## October redesign
Original hero restored. Compact photo cards with hover reveal. Real bamboo grove story with replayable material-to-delivery animation. Gathering planner calculates whole packs from guest counts and checks available stock, including existing bag quantities. Notebook, labelled sample-story carousel, FAQ accordion, and split bamboo closing section added. Demo order submission plays a 4.7-second bamboo-to-plate-to-package-to-truck sequence, with a skip control, before confirmation. No real transaction or shipment occurs.

Verified at 390px: no horizontal overflow and FAQ expansion. Browser checkout test: 30 guests, 2 packs each of plate/cup/cutlery, total ₹1,694, animated journey then confirmation. TypeScript and production build pass.


# bamboo
