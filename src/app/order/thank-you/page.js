"use client";

import { Suspense } from "react";
import SuccessPage from "../../components/SuccessPage";

export default function ThankYou() {
  return (
    // <Suspense fallback={<div>Loading details...</div>}>
      <SuccessPage />
    // </Suspense>
  );
}
