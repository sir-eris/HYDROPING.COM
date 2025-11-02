"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FaApple } from "react-icons/fa";
// import iOSAppThumbnail from "../../../public/iOSApp-512.png";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentIntent, setPaymentIntent] = useState(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentIntentId = searchParams.get("payment_intent");
      if (!paymentIntentId) return;
      window.history.replaceState({}, "", "/order/thank-you");

      try {
        const res = await fetch(
          "https://q15ur4emu9.execute-api.us-east-2.amazonaws.com/default/confirmStripePayment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentIntentId }),
          }
        );
        const data = await res.json();

        if (data && data.error) {
          return router.push("/");
        }
        if ((data && !data.paymentIntent) || !data.paymentIntent.id)
          return router.push("/");

        setPaymentIntent(data.paymentIntent);
      } catch {
        router.push("/");
      }
    };

    confirmPayment();
  }, [router, searchParams]);

  return (
    <div className="relative">
      {paymentIntent && (
        <main className="relative min-h-screen flex-col items-center justify-center py-24 pb-48">
          <div id="payment-status" className="w-4/5 lg:w-1/3 mx-auto pt-12">
            <h2
              id="status-text"
              className="text-center capitalize text-lg font-bold mb-6"
            >
              1. Payment
            </h2>
            <div id="details-table" className="mb-18">
              <div className="w-full space-y-2">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">
                    Confirmation
                  </span>
                  <span className="text-gray-900">
                    {paymentIntent?.id.slice(3, 15) ?? "..."}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">Status</span>
                  <span className="text-gray-900">
                    {paymentIntent?.status ?? "..."}
                  </span>
                </div>
                {/* <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">
                    Payment Details
                  </span>
                  <span className="text-gray-900">
                    <a
                      href={`https://dashboard.stripe.com/payments/${paymentIntentId}`}
                      id="view-details"
                      target="_blank"
                      className=" text-blue-500 underline underline-offset-4 hover:no-underline"
                    >
                      View
                    </a>
                  </span>
                </div> */}
              </div>
            </div>

            <div className="text-center w-fit mx-auto">
              <p className="mb-6 capitalize text-lg font-bold">
                2. Next, download the App
              </p>
              <img
                src="../../../public/iOSApp-512.png"
                width={256}
                height={256}
                alt="HydroPing_iOS_App_Icon_512"
                className="rounded-3xl border border-gray-200 mx-auto mb-6"
              />
              <p className="mb-5">HydroPing</p>
              <a
                href="https://apps.apple.com/us/app/hydro-ping/id6748595859"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-x-3 w-fit mx-auto rounded-full mb-4 bg-black hover:bg-black/80 text-white text-center font-sans text-lg py-2 px-8"
              >
                <FaApple color={"#FFFFFF"} className="w-6 h-6" />
                Download on App Store
              </a>
              <p className="text-[10px] text-gray-500">
                We&apos;ll remind you again once <br />
                your order is processed.
              </p>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
