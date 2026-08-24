# RetroParts REST API Documentation

Base URL: `http://localhost:5000/api` (or `https://your-backend-domain.com/api`)

All endpoints return JSON responses. Protected endpoints expect the Bearer token in the `Authorization` header:
`Authorization: Bearer <JWT_ACCESS_TOKEN>`

---

## 1. Authentication (`/api/auth`)

### Register Local Account
* **Method**: `POST`
* **Path**: `/api/auth/register`
* **Auth**: Public
* **Body**:
```json
{
  "name": "Aditya Sharma",
  "email": "restorer@retroparts.test",
  "password": "StrongPassword123!",
  "phone": "+91 98765 43210",
  "role": "buyer" // "buyer" | "seller"
}
```
* **Response** (201 Created):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUz...",
  "accessToken": "eyJhbGciOiJIUz...",
  "user": {
    "id": "6a868...",
    "name": "Aditya Sharma",
    "email": "restorer@retroparts.test",
    "role": "buyer",
    "isVerifiedSeller": false
  }
}
```
*(Also sets `retroparts_refresh_token` in an `httpOnly`, `SameSite`, secure cookie)*

---

### Login Local Account
* **Method**: `POST`
* **Path**: `/api/auth/login`
* **Auth**: Public
* **Body**:
```json
{
  "email": "restorer@retroparts.test",
  "password": "StrongPassword123!"
}
```
* **Response** (200 OK): Same as Register.

---

### Google OAuth 2.0
* **Initiate Redirect**: `GET /api/auth/google` (Redirects to Google Sign-In)
* **Callback Handler**: `GET /api/auth/google/callback` (Redirects to frontend `${CLIENT_URL}/auth/google/callback?token=...`)

---

### Refresh Access Token
* **Method**: `POST`
* **Path**: `/api/auth/refresh`
* **Auth**: Cookie (`retroparts_refresh_token`) or body `{ "refreshToken": "..." }`
* **Response** (200 OK):
```json
{
  "success": true,
  "token": "<NEW_JWT_ACCESS_TOKEN>",
  "accessToken": "<NEW_JWT_ACCESS_TOKEN>",
  "user": { ... }
}
```

---

### Logout
* **Method**: `POST`
* **Path**: `/api/auth/logout`
* **Auth**: Public
* **Response** (200 OK): Clears the refresh cookie.

---

### Get Authenticated User Profile
* **Method**: `GET`
* **Path**: `/api/auth/me`
* **Auth**: Bearer Token
* **Response** (200 OK): User profile object.

---

### Request Seller Verification
* **Method**: `POST`
* **Path**: `/api/auth/verify-seller`
* **Auth**: Bearer Token
* **Response** (200 OK): `{ "success": true, "verificationStatus": "pending" }`

---

## 2. Vehicles Reference Taxonomy (`/api/vehicles`)

### List Vehicle Brands
* **Method**: `GET`
* **Path**: `/api/vehicles/brands`
* **Query Params**: `type` (optional: `car` | `bike`)
* **Response** (200 OK): `["Bajaj", "Hindustan Motors", "Honda", "Maruti Suzuki", "Yamaha", ...]`

---

### List Models by Brand
* **Method**: `GET`
* **Path**: `/api/vehicles/models?brand=Yamaha` (or `/api/vehicles/brand/Yamaha/models`)
* **Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "brand": "Yamaha",
      "model": "RX100",
      "type": "bike",
      "yearFrom": 1985,
      "yearTo": 1996,
      "variants": ["Standard 98cc", "Made-in-Japan Escorts"]
    }
  ]
}
```

---

### Check Vehicle Fitment & Compatibility
* **Method**: `POST`
* **Path**: `/api/vehicles/check-compatibility`
* **Body**:
```json
{
  "listingId": "6a868...",
  "brand": "Yamaha",
  "model": "RX100",
  "year": 1989
}
```
* **Response** (200 OK):
```json
{
  "success": true,
  "compatible": true,
  "matchType": "Direct OEM Match",
  "details": "Exact match for Yamaha RX100"
}
```

---

## 3. Listings / Parts Marketplace (`/api/listings`)

### Search & Filter Listings
* **Method**: `GET`
* **Path**: `/api/listings`
* **Query Params**:
  * `search`: Multi-token search string (e.g. `RX100 carburetor`, `Honda City brake pad`)
  * `brand`: Vehicle make (e.g. `Yamaha`, `Maruti Suzuki`)
  * `model`: Vehicle model (e.g. `RX100`, `800 (SS80)`)
  * `year`: Production year (e.g. `1989`)
  * `category`: Category name (e.g. `Engine Parts`, `Lighting & Gauges`)
  * `condition`: `NOS (New Old Stock)` | `OEM Mint` | `OEM Refurbished` | `Used - Grade A`
  * `rarity`: `Extremely Rare / Holy Grail` | `Rare Find` | `Discontinued OEM`
  * `minPrice` / `maxPrice`: Numeric price boundary
  * `verifiedOnly`: `true` (filters only verified sellers)
  * `sort`: `newest` | `price_asc` | `price_desc` | `popular`
  * `page`, `limit`: Pagination parameters

---

### Get Listing by ID
* **Method**: `GET`
* **Path**: `/api/listings/:id`
* **Response** (200 OK): Returns listing details, seller profile, and similar parts.

---

### Create Listing
* **Method**: `POST`
* **Path**: `/api/listings`
* **Auth**: Bearer Token (Seller / Admin)
* **Body**:
```json
{
  "title": "Yamaha RX100 Original Mikuni Slide Carburetor Japan NOS",
  "description": "Authentic Japanese-manufactured Mikuni 20mm round slide carburetor in factory box.",
  "categoryName": "Engine Parts",
  "vehicleBrand": "Yamaha",
  "vehicleModel": "RX100",
  "vehicleYear": 1989,
  "vehicleVariant": "Standard 98cc",
  "oemNumber": "17G-14101-00-JP",
  "condition": "NOS (New Old Stock)",
  "partType": "OEM Original",
  "price": 8500,
  "quantity": 2,
  "images": ["https://images.unsplash.com/..."],
  "location": { "city": "Bengaluru", "state": "Karnataka", "pincode": "560025" },
  "compatibleVehicles": [
    { "brand": "Yamaha", "model": "RX100", "yearFrom": 1985, "yearTo": 1996, "variant": "All Variants" }
  ]
}
```
*(Automatically triggers match-on-create notifications for any matching wanted part requests)*

---

### Update Listing
* **Method**: `PUT`
* **Path**: `/api/listings/:id`
* **Auth**: Bearer Token (Listing Owner / Admin)

---

### Delete Listing
* **Method**: `DELETE`
* **Path**: `/api/listings/:id`
* **Auth**: Bearer Token (Listing Owner / Admin)

---

## 4. Wanted Parts Community Bounties (`/api/wanted` or `/api/wanted-parts`)

### List Wanted Requests
* **Method**: `GET`
* **Path**: `/api/wanted`
* **Query Params**: `brand`, `model`, `urgency`, `status`, `search`

---

### Create Wanted Request
* **Method**: `POST`
* **Path**: `/api/wanted`
* **Auth**: Bearer Token
* **Body**:
```json
{
  "title": "Maruti 800 1984 SS80 Original Chrome Grille",
  "description": "Looking for mint condition front grille with central M badge.",
  "vehicleBrand": "Maruti Suzuki",
  "vehicleModel": "800 (SS80)",
  "vehicleYear": 1984,
  "targetBudget": 6000,
  "urgency": "urgent",
  "conditionRequired": "NOS Only"
}
```

---

### Submit Seller Quote / Offer
* **Method**: `POST`
* **Path**: `/api/wanted/:id/offers` (or `/api/wanted/:id/offer`)
* **Auth**: Bearer Token (Seller / Admin)
* **Body**:
```json
{
  "offerPrice": 5800,
  "message": "[NOS Mint | Est. Delivery: 3 days] I have an authentic SS80 original grille in original packaging."
}
```

---

## 5. Orders & Escrow Vault (`/api/orders`)

### Place Order
* **Method**: `POST`
* **Path**: `/api/orders`
* **Auth**: Bearer Token
* **Body**:
```json
{
  "items": [
    { "listingId": "6a868...", "quantity": 1 }
  ],
  "shippingAddress": {
    "fullName": "Kavita Sharma",
    "phone": "+91 97690 99881",
    "addressLine": "Flat 402, Sea View Apartments",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400050"
  },
  "paymentMethod": "mock_card"
}
```

---

### Update Order Status
* **Method**: `PUT`
* **Path**: `/api/orders/:id/status`
* **Auth**: Bearer Token (Seller / Admin)
* **Body**:
```json
{
  "status": "dispatched", // "confirmed" | "dispatched" | "in_transit" | "delivered" | "completed"
  "trackingNumber": "VINTAGE-EXP-99281",
  "trackingCourier": "BlueDart Vintage Cargo",
  "note": "Dispatched in reinforced wooden crate."
}
```

---

## 6. Real-Time Chat (`/api/chat` or `/api/messages`)

### List Conversations
* **Method**: `GET`
* **Path**: `/api/chat/conversations`
* **Auth**: Bearer Token

---

### Send Message
* **Method**: `POST`
* **Path**: `/api/chat/send` (or `/api/chat/messages`)
* **Auth**: Bearer Token
* **Body**:
```json
{
  "recipientId": "6a868...",
  "text": "Is this Yamaha carburetor available for shipping?",
  "listingId": "6a868..." // Optional
}
```

---

## 7. Reviews (`/api/reviews`)

### Submit Review (Gated on Completed Order)
* **Method**: `POST`
* **Path**: `/api/reviews`
* **Auth**: Bearer Token
* **Body**:
```json
{
  "sellerId": "6a868...",
  "orderId": "6a868...",
  "rating": 5,
  "comment": "Authentic NOS component, arrived well-packaged."
}
```
*(Rejects with 400 Bad Request if order is not completed/delivered or was not placed by the user)*

---

### Get Seller Reviews
* **Method**: `GET`
* **Path**: `/api/reviews/seller/:sellerId`
* **Auth**: Public

---

## 8. Admin Console (`/api/admin`)

### Get Platform Statistics
* **Method**: `GET`
* **Path**: `/api/admin/stats`
* **Auth**: Bearer Token (Admin Role)

---

### Get Pending Seller Verifications
* **Method**: `GET`
* **Path**: `/api/admin/verifications`
* **Auth**: Bearer Token (Admin Role)

---

### Approve / Reject Seller Verification
* **Method**: `PUT`
* **Path**: `/api/admin/verifications/:userId`
* **Auth**: Bearer Token (Admin Role)
* **Body**:
```json
{
  "status": "verified",
  "isVerifiedSeller": true
}
```
