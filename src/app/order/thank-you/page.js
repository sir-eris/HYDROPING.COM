import { Suspense } from "react";
import Component from "./component";

export default function SuccessPage() {

  return (
    <Suspense fallback={<div>Loading details...</div>}>
      <Component />
    </Suspense>
  );
}
