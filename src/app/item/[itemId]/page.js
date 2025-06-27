// pages/item/[id].js (or app/item/[id]/page.js if using App Router)
"use client";
import { useParams } from "next/navigation";
import ItemView from "../../common/ItemView";

const ItemDetailPage = () => {
  const { id } = useParams();

  return <ItemView itemId={id} />;
};

export default ItemDetailPage;
