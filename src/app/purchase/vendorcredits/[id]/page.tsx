"use client";

import { useParams } from "next/navigation";
import CreditView from "../../../common/credits/CreditView";

export default function Page(_props?: any) {
  const { id } = useParams()!;
  return <CreditView kind="purchase" creditNumber={decodeURIComponent(id as string)} />;
}
