import React, { Suspense } from "react";
import CreatePassword from "./CreatePassword";

export default function Page(_props?: any) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePassword />
    </Suspense>
  );
}
