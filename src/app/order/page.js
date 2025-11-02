"use client";
import { useState } from "react";
import Head from "next/head";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import dynamic from "next/dynamic";

const AddressAutofill = dynamic(
  () => import("@mapbox/search-js-react").then((mod) => mod.AddressAutofill),
  { ssr: false }
);

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
const PAYMENT_CURRENCY = {
  name: "usd",
  symbol: "$",
};

export default function StripeOrder() {
  const [clientSecret, setClientSecret] = useState(null);
  const [clientSecretError, setClientSecretError] = useState(false);
  const [taxAmount, setTaxAmount] = useState(null);
  const [orderTotal, setOrderTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [promo, setPromo] = useState("");
  const [discountPercent, setDiscountPercent] = useState(null);
  const [colors, setColors] = useState([
    {
      id: "BLACK",
      quantity: 1,
      amount: 3000,
      taxCode: "txcd_99999999",
      uiColor: "#22223B",
    },
    {
      id: "ORANGE",
      quantity: 0,
      amount: 3000,
      taxCode: "txcd_99999999",
      uiColor: "#F77F00",
    },
    ,
    {
      id: "BLUE",
      quantity: 0,
      amount: 3000,
      taxCode: "txcd_99999999",
      uiColor: "#0466C8",
    },
    ,
    {
      id: "GREEN",
      quantity: 0,
      amount: 3000,
      taxCode: "txcd_99999999",
      uiColor: "#38B000",
    },
  ]);
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    formatted_address: ""
  });
  const [addressError, setAddressError] = useState("");


  const onAddItem = (colorId) => {
    setColors((prev) =>
      prev.map((c) =>
        c.id === colorId ? { ...c, quantity: c.quantity + 1 } : c
      )
    );
    setTaxAmount(null);
    setClientSecret(null);
  };

  const onRemoveItem = (colorId) => {
    setColors((prev) =>
      prev.map((c) =>
        c.id === colorId ? { ...c, quantity: Math.max(0, c.quantity - 1) } : c
      )
    );
    setClientSecret(null);
  };

  const handleAddressLine2Change = (e) => {
    setAddress(prev => {
      return {
        ...prev,
        line2: e.target.value.trim(),
      };
    })
  }

  const handleAutofillRetrieve = (response) => {
    setAddressError("");
    
    const selectedAddress = response.features[0]?.properties;
    setAddress({
      line1: selectedAddress.address_line1,
      line2: selectedAddress.address_line2,
      city: selectedAddress.address_level2,
      state: selectedAddress.address_level1,
      postal_code: selectedAddress.postcode,
      country: selectedAddress.country_code,
      formatted_address: selectedAddress.full_address,
    });
  };

  const handleChangeAddress = () => {
    setAddress({
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      formatted_address: "",
    });
    setClientSecret(null);
    setIsLoading(false);
    setTaxAmount(null);
  };

  const handleEditPromo = (e) => {
    setPromo(e.target.value);
    setClientSecret(null);
    setIsLoading(false);
    setTaxAmount(null);
  };

  const handleNameChange = (e) => {
    const value = e.target.value.trimStart(); // trim only leading spaces while typing
    setName(value);
    setNameError("");
  }

  const handleEmailChange = (e) => {
    const value = e.target.value.trim();
    setEmail(value);
    setEmailError("");
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.trim();
    setPhone(value);
    setPhoneError("");
  }

  // helper
  const validateShippingInfo = () => {
    let errorCount = 0;

    // --- Full Name Validation ---
    if (!/^[a-zA-Z]+(?: [a-zA-Z]+)+$/.test(name.trim())) {
      setNameError("Please enter your full name (first and last).");
      errorCount++;
    } else {
      setNameError(""); // clear error
    }

    // --- Email Validation ---
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      errorCount++;
    } else {
      setEmailError(""); // clear error
    }

    // --- Phone Validation ---
    if (!/^\+?\d{10,15}$/.test(phone.trim())) {
      setPhoneError("Please enter a valid phone number.");
      errorCount++;
    } else {
      setPhoneError(""); // clear error
    }

    if (Object.entries(address).some(([key, value]) => key !== "line2" && value.trim() === "")) {
      setAddressError("Please confirm a formatted option.");
    } else {
      setAddressError("");
    }

    // --- Stop if there is at least one error ---
    return errorCount;
  }

  const getClientSecret = async () => {
    const errorCount = validateShippingInfo();
    if (errorCount > 0) return;

    if (colors.filter((item) => item.quantity > 0).length < 1) {
      return;
    }

    setIsLoading(true);
    setClientSecretError(false);

    // prep order items
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { formatted_address, ..._address } = address;
    const order = {
      items: colors
        .filter((item) => item.quantity > 0)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ uiColor, ...rest }) => rest),
      address: _address,
      promo,
      currency: PAYMENT_CURRENCY.name,
    };

    // call backend
    try {
      const res = await fetch(
        "https://q15ur4emu9.execute-api.us-east-2.amazonaws.com/default/getStripeCS",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...order
          }),
        }
      );
      const data = await res.json();

      if (data.error) {
        setIsLoading(false);
        setClientSecretError(true);
        return;
      }

      setTaxAmount(data.taxAmount);
      setDiscountPercent(data.discountPercent);
      setOrderTotal(data.total);
      setTimeout(() => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.log("Error fetching client secret:", error);
      setIsLoading(false);
      setClientSecretError(true);
    }
  };

  return (
    <>
      <Head>
        <title>HydroPing - Order Yours</title>
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="relative">
        <main className="relative min-h-screen flex-col items-center justify-center py-24 pb-48">
          <div className="w-4/5 lg:w-1/2 2xl:w-5/12 mx-auto mb-5 pt-12">
            {/* title */}
            <h1 className="font-bold text-xl lg:text-3xl mb-14 text-center capitalize lg:leading-11">
              HydroPing Smart Soil Moisture Stick with 5+ years battery and
              Integrated Wi-Fi.
            </h1>

            {/* options */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 mb-4">
              {colors.map((color) => (
                <div key={color.id} className="mb-6">
                  <div className="text-center font-bold lg:text-lg mb-2">
                    <p>{color.id}</p>
                  </div>
                  <div
                    className="w-full h-4 mb-4 rounded-4xl"
                    style={{ backgroundColor: color.uiColor }}
                  ></div>

                  <div className="flex w-full justify-center items-center gap-x-6 lg:gap-x-8">
                    <div
                      onClick={() => onRemoveItem(color.id)}
                      className="w-7 lg:w-10 h-7 lg:h-10 flex justify-center items-center rounded-full bg-gray-50 border border-white drop-shadow-sm hover:bg-gray-100 hover:border-gray-200 cursor-pointer"
                    >
                      -
                    </div>
                    <div
                      onClick={() => onAddItem(color.id)}
                      className="w-7 lg:w-10 h-7 lg:h-10 flex justify-center items-center rounded-full bg-gray-50 border border-white drop-shadow-sm hover:bg-gray-100 hover:border-gray-200 cursor-pointer"
                    >
                      +
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* order summary */}
            <div className="">
              <p className="font-semibold text-gray-700 mb-6">Order Summary</p>
              {colors.filter((color) => color.quantity > 0).length < 1 && (
                <p className="text-center">
                  Please select a quantity of your desired color.
                </p>
              )}
              {colors
                .filter((color) => color.quantity > 0)
                .map((color) => (
                  <div
                    key={color.id}
                    className="mb-4 px-4 text-sm flex justify-between items-baseline"
                  >
                    <p>{color.id}</p>
                    <p>
                      {color.quantity} x {PAYMENT_CURRENCY.symbol}
                      {color.amount / 100}.00
                    </p>
                  </div>
                ))}

              <div className="mb-4 mt-2 px-4 text-sm flex justify-between items-baseline">
                <p>Subtotal</p>
                <p>
                  {PAYMENT_CURRENCY.symbol}
                  {colors.reduce((sum, color) => {
                    return sum + (color.quantity * color.amount) / 100;
                  }, 0)}
                  .00
                </p>
              </div>

              <div className="mb-4 mt-2 px-4 text-sm flex justify-between items-baseline">
                <p>Promo Code</p>
                <div>
                  <span className="pr-2 text-xs">
                    {discountPercent != null
                      ? discountPercent == 0
                        ? "Invalid code."
                        : "Validated."
                      : null}
                  </span>
                  <input
                    id="promo"
                    name="promo"
                    type="text"
                    value={promo}
                    onChange={handleEditPromo}
                    placeholder="Enter Code"
                    className="rounded-xl w-32 px-3 py-1 bg-[#f1f1f1] text-sm placeholder:text-xs placeholder:font-normal placeholder:text-center font-bold uppercase"
                  />
                </div>
              </div>

              <div className="mb-4 mt-2 px-4 text-sm flex justify-between items-baseline">
                <p>Shipping & Handling</p>
                <p>Free</p>
              </div>

              <div className="mb-4 mt-2 px-4 text-sm flex justify-between items-baseline">
                <p>Tax</p>
                <p
                  className={`transition-opacity duration-300 ${
                    orderTotal == null ? "opacity-50" : "opacity-100"
                  }`}
                >
                  {taxAmount != null
                    ? PAYMENT_CURRENCY.symbol + taxAmount / 100 + ".00"
                    : "Enter shipping details"}
                </p>
              </div>

              <div className="mb-4 mt-2 px-4 text-sm flex justify-between items-baseline">
                <p>Total</p>
                <p
                  className={`transition-opacity duration-300 ${
                    orderTotal == null ? "opacity-50" : "opacity-100"
                  }`}
                >
                  {orderTotal != null
                    ? PAYMENT_CURRENCY.symbol + orderTotal / 100 + ".00"
                    : "..."}{" "}
                  {discountPercent != null && discountPercent > 0
                    ? "(" + promo + " applied)"
                    : null}
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-300 w-4/5 lg:w-1/2 2xl:w-5/12 rounded-2xl mx-auto mb-5" />

          {/* shipping details */}
          <div className="w-4/5 lg:w-1/2 2xl:w-5/12 mx-auto mb-5">
            <p className="mb-6 font-semibold">Shipping Information</p>
            {clientSecret == null ? (
              <div className="px-4">
                <div className="xl:flex gap-x-4">
                  <div className="w-full xl:w-3/5 h-24">
                    <p className="text-sm px-1">Full Name</p>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      // pattern="^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$"
                      value={name}
                      onChange={handleNameChange}
                      className="mb-1 rounded-xl w-full px-4 py-3 bg-[#f1f1f1]"
                    />

                    {nameError?.length ? (
                      <p className="text-red-500 font-bold text-xs text-left">
                        {nameError}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="w-full xl:w-2/5 h-24">
                    <p className="text-sm px-1">Phone Number</p>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      pattern="^\+?[0-9\s\-\(\)]{7,15}$"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="mb-1 rounded-xl w-full px-4 py-3 bg-[#f1f1f1]"
                    />
                    {phoneError?.length ? (
                      <p className="text-red-500 font-bold text-xs text-left">
                        {phoneError}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="w-full h-24">
                  <p className="text-sm px-1">Email Address</p>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    // pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    value={email}
                    onChange={handleEmailChange}
                    className="mb-1 rounded-xl w-full px-4 py-3 bg-[#f1f1f1]"
                  />
                  {emailError?.length ? (
                    <p className="text-red-500 font-bold text-xs text-left mb-4">
                      {emailError}
                    </p>
                  ) : (
                    ""
                  )}
                </div>

                <div className="xl:flex gap-x-6">
                  <div className="w-full xl:w-4/5">
                    <div className="w-full h-24 ">
                      <p className="text-sm">Shipping Address</p>
                      <form>
                        <AddressAutofill
                          onRetrieve={handleAutofillRetrieve}
                          accessToken="pk.eyJ1Ijoic2lyLWVyaXMiLCJhIjoiY21oNWV5ZzMwMDFrdDJsb29kdW8yNW9wayJ9.3p8YGIkFNWRUIY2d5KlLIg"
                        >
                          <input
                            type="text"
                            name="address-1"
                            autoComplete="address-line1"
                            className="mb-1 rounded-xl w-full px-4 py-3 bg-[#f1f1f1]"
                          />
                          <input
                            type="text"
                            name="address-2"
                            autoComplete="address-line2"
                            className="invisible w-0 h-0"
                          />
                          <input
                            type="text"
                            name="city"
                            autoComplete="address-level2"
                            className="invisible w-0 h-0"
                          />
                          <input
                            type="text"
                            name="state"
                            autoComplete="address-level1"
                            className="invisible w-0 h-0"
                          />
                          <input
                            type="text"
                            name="zip"
                            autoComplete="postal-code"
                            className="invisible w-0 h-0"
                          />
                        </AddressAutofill>
                      </form>

                      {addressError?.length ? (
                        <p className="text-gray-500 font-bold text-xs text-left mb-4">
                          {addressError}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="w-full xl:w-1/5">
                    <p className="text-sm px-1">Apt, Suit, Unit</p>
                    <input
                      id="line2"
                      name="line2"
                      type="text"
                      value={address.line2}
                      onChange={handleAddressLine2Change}
                      className="mb-4 rounded-xl w-full px-4 py-3 bg-[#f1f1f1]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-1">
                  {name}, {phone}
                </p>
                <div className="flex justify-between items-baseline">
                  <p>{address.formatted_address}</p>
                  <button
                    onClick={handleChangeAddress}
                    className="underline underline-offset-4 hover:no-underline font-semibold text-blue-500 text-sm"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* submit */}
          <div className="mx-auto w-fit text-center">
            {clientSecret == null ? (
              <button
                className="font-bold text-xl text-green-500 underline underline-offset-4 hover:no-underline"
                onClick={!isLoading ? getClientSecret : null}
                disabled={isLoading}
              >
                {isLoading ? "..." : "Continue to Pay"}
              </button>
            ) : null}
          </div>

          {clientSecretError && (
            <>
            <br />
              <p className="font-bold text-sm text-red-600 text-center mx-auto w-fit">
                Please confirm your information is correct. <br />
                Be sure to select a formatted address option.
              </p>
            </>
          )}
          {/* payment */}
          {clientSecret != null ? (
            <>
              <hr className="border-gray-300 w-4/5 lg:w-1/2 2xl:w-5/12 rounded-2xl mx-auto mb-5" />
              <div id="checkout" className="w-4/5 lg:w-1/2 2xl:w-5/12 mx-auto">
                <Elements
                  stripe={stripePromise}
                  options={{ appearance: { theme: "flat" }, clientSecret }}
                >
                  <PaymentForm email={email} />
                </Elements>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </>
  );
}

function PaymentForm({ email }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "https://hydroping.com/order/thank-you",
        receipt_email: email,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      console.log(error);
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = { layout: "accordion" };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <p className="mb-4 font-semibold">Payment Information</p>
      <PaymentElement
        id="payment-element"
        className="px-4"
        options={paymentElementOptions}
      />
      <br />
      <br />

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="block w-fit mx-auto text-center"
      >
        <span id="button-text" className="block mx-auto">
          <p className="font-bold text-xl text-green-500 underline underline-offset-4 hover:no-underline">
            {isLoading ? "..." : "Pay now"}
          </p>
        </span>
      </button>

      <br />
      {/* Show any error or success messages */}
      {message && (
        <div
          id="payment-message"
          className="text-center mb-6 text-red-500 font-black w-fit mx-auto text-sm"
        >
          Oh! {message}
        </div>
      )}
    </form>
  );
}