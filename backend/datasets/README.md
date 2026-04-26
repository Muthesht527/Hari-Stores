# Sample MongoDB Dataset

These files are import-ready sample collections for Hari Enterprises:

- `users.json`
- `products.json`
- `orders.json`

## Import order

1. `users.json`
2. `products.json`
3. `orders.json`

`orders.json` references the `_id` values from the sample users and products.

## Atlas / Compass

Import each file into its matching collection:

- `users` collection <- `users.json`
- `products` collection <- `products.json`
- `orders` collection <- `orders.json`

If the tool asks, import as JSON array / Extended JSON.

## Notes

- These are demo records only.
- Real login users are still created by Firebase authentication.
- The sample admin user has:
  - `firebaseUid`: `seed-admin-uid`
  - `email`: `admin@harienterprises.local`

That admin record is useful for UI and data testing, but it will not log in through Firebase unless you create a real Firebase user that maps to it.
