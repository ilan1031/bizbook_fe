"use client";

import { useParams } from "next/navigation";
import CreditForm from "../../../../common/credits/CreditForm";

export default function Page(_props?: any) {
  const { id } = useParams()!;
  return <CreditForm kind="purchase" creditNumber={decodeURIComponent(id as string)} />;
}
