import { Suspense } from "react";
import SuccessPage from "./SuccessPage";

export default function SuccessPage() {

  return (
    <Suspense fallback={<div>Loading details...</div>}>
      <SuccessPage />
    </Suspense>
  );
}
