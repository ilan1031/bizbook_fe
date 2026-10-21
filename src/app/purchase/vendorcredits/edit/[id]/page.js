"use client";

import { useParams } from "next/navigation";
import CreditForm from "../../../../common/credits/CreditForm";

export default function Page() {
  const { id } = useParams();
  return <CreditForm kind="purchase" creditNumber={decodeURIComponent(id)} />;
}
