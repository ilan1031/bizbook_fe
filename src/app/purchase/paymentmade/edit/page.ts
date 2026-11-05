"use client";

// Payments are edited on the create screen (?paymentId=...), which loads the
// payment and saves it through PUT /payments/update. Old links land here.
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditPaymentRedirect() {
  const router = useRouter();
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get("paymentId") || query.get("id");
    router.replace(id ? `/purchase/paymentmade/create?paymentId=${encodeURIComponent(id)}` : "/purchase/paymentmade");
  }, [router]);
  return null;
}
