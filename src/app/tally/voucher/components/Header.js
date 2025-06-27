// components/Header.js
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

const Header = ({
  title = "Accounting Voucher Creation",
  onClose,
  formData = {},
  isStatus,
}) => {
  const router = useRouter();
  const [isZoho, setIsZoho] = useState(true);

  const toggleMode = () => {
    // Save current form data to localStorage
    if (formData && Object.keys(formData).length > 0) {
      const {
        contactDetails,
        items,
        voucherDate,
        placeOfSupply,
        gstTreatment,
        paymentTerms,
        tdsId,
        tcsId,
        discountPercent,
        discountAmount,
        subTotal,
        taxTotal,
        total,
        adjustment,
        narration,
        terms,
      } = formData;

      const sharedData = {
        customer_id: contactDetails?.contact_id,
        customer_name: contactDetails?.contact_name,
        company_name: contactDetails?.company_name,
        billing_address: contactDetails?.billing_address,
        shipping_address: contactDetails?.shipping_address,
        place_of_contact: contactDetails?.place_of_contact,
        gst_no: contactDetails?.gst_no,
        contact_type: contactDetails?.contact_type,
        opening_balance_amount: contactDetails?.opening_balance_amount,
        line_items: items?.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
          unit: item.unit,
        })),
        date: voucherDate,
        place_of_supply: placeOfSupply,
        gst_treatment: gstTreatment,
        payment_terms: paymentTerms,
        tds_id: tdsId,
        tcs_id: tcsId,
        discount_percent: discountPercent,
        discount_amount: discountAmount,
        sub_total: subTotal,
        tax_total: taxTotal,
        total: total,
        adjustment: adjustment,
        notes: narration,
        terms: terms,
        isStatus: isStatus,
      };

      localStorage.setItem("sharedFormData", JSON.stringify(sharedData));
      localStorage.setItem("fromTally", "true");
    }

    setIsZoho((prev) => !prev);

    // Route based on isStatus
    if (isStatus === "Quote") {
      router.push("/sales/quotes/new");
    }else if  (isStatus === "Invoice") {
      router.push("/sales/invoices/new");
    }else if  (isStatus === "PurchaseOrder") {
      router.push("/purchase/purchaseorder/create");
    }else if  (isStatus === "Bill") {
      router.push("/purchase/bills/create");
    }
    else {
      router.push("/sales/salesOrder/new");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#336699",
        color: "white",
        padding: "4px 10px",
        fontSize: "12px",
      }}
    >
      <div>{title || "Accounting Voucher Creation"}</div>
      <div style={{ textAlign: "center", flex: 1 }}>iHub</div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={toggleMode}
        >
          <span style={{ marginLeft: "5px", fontWeight: "bold" }}>
            {"Tally"}
          </span>
          {isZoho ? (
            <ToggleOffIcon style={{ color: "gray", fontSize: "18px" }} />
          ) : (
            <ToggleOnIcon style={{ color: "white", fontSize: "18px" }} />
          )}
        </div>
        <div
          style={{
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={onClose}
        >
          ✕
        </div>
      </div>
    </div>
  );
};

export default Header;
