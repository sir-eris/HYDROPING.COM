"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaApple } from "react-icons/fa";


export default function ThankYou({ params }) {
  const { paymentId } = React.use(params);
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch(
          "https://q15ur4emu9.execute-api.us-east-2.amazonaws.com/default/confirmStripePayment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId: "seti_" + paymentId }),
          }
        );
        const data = await res.json();

        if (!data || data.error || !data.status) {
          return router.push("/");
        }

        setData(data);
      } catch {
        return router.push("/");
      }
    };

    verifyPayment();
  }, [router, paymentId]);

  return (
    <div className="relative">
      {data?.status == "succeeded" && (
      <main className="relative min-h-screen flex-col items-center justify-center py-24 pb-48">
        <div id="payment-status" className="w-4/5 lg:w-1/3 mx-auto pt-12">
          <h2
            id="status-text"
            className="text-center text-lg font-bold mb-4"
          >
            Order Placed Successfully.
          </h2>

          <div className="text-center w-fit mx-auto">
            <p className="mb-6 text-gray-600">
              Your subscription won&apos;t start until your order is shipped and delivered. You&apos;ll be notified once your order is shipped. You can manage your subscriptions in the app.
            </p>
            <img
              src="/iOSApp-512.png"
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