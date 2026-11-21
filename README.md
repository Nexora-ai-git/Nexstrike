# Hakimi Zari House

A responsive, elegant storefront for Hakimi Zari House.

## Included
- Responsive landing page and collection sections
- Product catalogue with category filters, search and sorting
- Product quick view
- Shopping bag with quantity controls and saved cart (local browser storage)
- Add to Bag and Buy Now actions
- WhatsApp order message flow

## Publish
This is a static website. Enable GitHub Pages for the `main` branch and root folder, or deploy the repository to Cloudflare Pages.

## Before going live
1. Replace the sample catalogue, prices and product photography in `assets/js/app.js` with the shop's actual inventory.
2. Set the shop's WhatsApp number in `orderWhatsApp()` in `assets/js/app.js` by changing the `https://wa.me/?text=` URL to `https://wa.me/COUNTRYCODEPHONENUMBER?text=`.
3. Add the shop's real address, business hours and social links when available.

**Note:** Product names, images and prices currently form a starter catalogue/demo and should be verified by the business before accepting customer orders. No online card-payment gateway is connected.
