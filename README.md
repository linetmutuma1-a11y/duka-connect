# DukaConnect

DukaConnect is a Node.js and Express API that manages products, orders, M-PESA payments, and AI-powered product descriptions using Google Gemini.

## Features

* Manage products
* Manage orders
* Initiate M-PESA STK Push payments
* Receive M-PESA payment callbacks
* Generate product descriptions using Google Gemini AI

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd duka-connect
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file and add your API credentials

```env
SANDBOX_MPESA_CONSUMER_KEY=
SANDBOX_MPESA_CONSUMER_SECRET=
SANDBOX_GEMINI_DUKA_AI_KEY=
SHORTCODE=
PASSKEY=
```

4. Start the application

```bash
node app.js
```

The server runs on:

```text
http://localhost:3000
```

## API Endpoints

### Products

```http
GET /products
GET /products/:id
POST /products
```

### Orders

```http
GET /orders
POST /orders
```

### Payments

```http
POST /stkpush
POST /mpesa/callback
GET /payments/payment-status/:checkoutRequestId
```

### AI

```http
POST /ai/generate-description
```

Example request:

```json
{
  "productName": "Wireless Earbuds",
  "keywords": "Bluetooth, noise cancellation, long battery life"
}
```

## Technologies Used

* Node.js
* Express.js
* M-PESA Daraja API
* Google Gemini API
* dotenv

## Author

Lynnette Mutuma
