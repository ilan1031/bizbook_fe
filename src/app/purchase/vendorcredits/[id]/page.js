"use client";

import { useParams } from "next/navigation";
import CreditView from "../../../common/credits/CreditView";

export default function Page() {
  const { id } = useParams();
  return <CreditView kind="purchase" creditNumber={decodeURIComponent(id)} />;
}
