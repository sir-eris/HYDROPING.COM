import "server-only";
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

// receives order details and returns stripe client secret for that transaction, tax amount, discount percentage, and final order total
export async function POST(req) {
  try {
    const data = await req.json();
    const { items, address, promo, currency } = data;

    // TODO verify and retrieve promo code %
    let discountPercent = 0;
    if (promo) {
      if (promo == "PLANTS26") {
        discountPercent = 0.2;
      }
    }

    // let amount = 0;
    const amount = items.reduce((sum, item) => { return sum += item.amount*item.quantity }, 0)
    // for (const i of items) {
    //   amount += i.amount * i.quantity;
    // }

    const buildLineItem = (item) => {
      return {
        amount: item.amount * item.quantity * (1 - discountPercent), // Amount in cents
        reference: item.id, // Unique reference for the item in the scope of the calculation
        tax_code: item.taxCode,
      };
    };

    const taxCalculation = await stripe.tax.calculations.create({
      currency,
      customer_details: {
        address,
        address_source: "shipping",
      },
      line_items: items.map((item) => buildLineItem(item)),
    });

    let total = amount * (1 - discountPercent) + taxCalculation.tax_amount_exclusive;

    // Create PaymentIntent as soon as the page loads
    const { client_secret: clientSecret } = await stripe.paymentIntents.create({
      amount: total,
      currency,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        // tax_calculation: taxCalculation.id,
        items: JSON.stringify(items),
      },
    });

    return NextResponse.json(
      {
        clientSecret,
        taxAmount: taxCalculation.tax_amount_exclusive,
        discountPercent: discountPercent == 0 ? null : discountPercent,
        total,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 200 });
  }
}

export async function OPTIONS() {
  const res = NextResponse.json(null, { status: 204 });

  // Set CORS headers for preflight requests
  res.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return res;
}
