# BAMBU shopping demo

A shopping-focused bamboo tableware concept for Madtech Solutions. BAMBU is
sample branding. The catalogue, prices and specifications are illustrative.

## Run

Use Node.js 20+ and npm:

```sh
npm install
npm run dev
npm run build
```

The Vite terminal prints the local address. Use `start-demo.cmd` for the
existing Windows launcher. Production output is `dist/`.

## Screens and interactions

- `/`: compact shopping banner, category tiles, featured products, gathering
  planner, bamboo material notes and FAQ.
- `/#shop`: complete catalogue, category/price/pack-size/availability filters,
  price/name sorting and responsive product grid.
- `/#saved`: saved products, persisted in this browser.
- `/#checkout`: full-page delivery form, demo payment and order review. Both
  Buy now and the bag checkout action open this route; Back returns to the bag.
- `/#admin`: demo inventory, orders, status changes and expense records.
- Product details: live stock, quantities in packs, per-unit pricing,
  Add to bag and Buy now. Cutlery pairs are counted as sets.
- Global search matches product names, categories and descriptions. Submit
  the search to open matching catalogue results.
- On mobile: sticky search/category header, two-column cards, filter drawer,
  bottom shopping navigation and sticky product purchase controls.

## Demonstrate the purchase flow

1. Search or browse the catalogue. Sort, filter and save a product.
2. Open a product, choose packs and add to the bag. The quantity accounts for
   packs already in the bag and cannot exceed available stock.
3. Delivery is INR59 below a product subtotal of INR999, and free at INR999+.
4. Continue to the separate `/#checkout` page using sample details. Refresh
   and browser Back work; an empty bag shows a return-to-shopping screen.
5. The bamboo-to-plate-to-package-to-truck animation leads to confirmation.
   It has a skip control and respects reduced-motion animation preferences.
6. Open demo admin to inspect the order, change its status, edit stock/prices,
   or record an expense. Changes persist on reload in the same browser.

The gathering planner calculates complete packs for 5-250 guests. Its kit has
one plate, cup and cutlery set per guest. All kit quantities are checked
before any are added to the bag.

## Technical scope

React, TypeScript, Vite, Lucide icons, custom CSS and native CSS/SVG animation.
Catalogue, bag, saved products, orders and expenses use localStorage. Stored
catalogue/history records are validated; cart IDs and integer quantities are
normalized against current products and stock. Modal focus follows each
checkout stage; the underlying page is inert while a root dialog is open.

This remains a simulated frontend demo. There is no account backend, real
payment, email, delivery service, shared inventory or cross-device sync.
Admin is intentionally open for demonstration. Production needs authenticated
server-side permissions and transactional inventory/order/payment services.

Sales include delivery. Sales minus recorded expenses is an indicative balance,
not a profit calculation. Stock is measured in packs.

## Verification - shopping revision, 18 October 2026

- TypeScript and Vite production build.
- Corrupt stored JSON, invalid catalogue records, unknown cart IDs, fractional
  or negative quantities, stock caps and invalid historical records checked.
- Browser search, category/price/pack filters, sorting, empty results, saved
  products and reload persistence checked.
- Mobile checkout: 2 plate packs + 1 cup pack = INR997 subtotal + INR59 delivery.
  Adding one tasting-spoon pack gives INR1146 with free delivery. The order
  completed, stock deducted correctly, and status persisted after reload.
- Admin expense recording and 30-guest kit calculation checked: 2 packs each
  of plates/cups/cutlery, INR1694 before delivery (free at this total).
- Desktop/mobile responsive layout and keyboard modal focus checked.
- Separate checkout page: Buy now, bag checkout, direct link/reload, edit bag
  and browser Back checked. Required fields and invalid PIN block submission.
  A mobile order completed at INR408 (INR349 + INR59 delivery). Empty checkout
  returns a shopping CTA. No horizontal overflow at 390px or 1440px.

## Photography

Existing local reference photography is retained. It is not the client's
confirmed product catalogue. Credits and replacement requirements are in
`design/PHOTO-SOURCES.md`. No reviews, discounts or certifications are invented.
The material story and FAQ appear on the homepage; product listings stay compact.

## Local dependencies

This checkout currently reuses installed packages through an ignored
node_modules junction. The package manifest and lockfile remain suitable for
an independent `npm install` elsewhere. No new dependencies were added.
