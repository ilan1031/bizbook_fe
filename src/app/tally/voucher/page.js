"use client"; // This is necessary for client components in Next.js 13 with the app directory
import React, { useEffect } from "react";
import AccountingVoucherCreation from "./AccountingVoucherCreation"; // Adjust the path as necessary
import { useSearchParams } from "next/navigation";

const Page = () => {
  const [isStatus, setIsStatus] = React.useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const getSharedFormData = () => {
      try {
        // First check URL parameters
        const urlIsStatus = searchParams.get("isStatus");
        if (urlIsStatus) {
          setIsStatus(urlIsStatus);
          return;
        }

        // If not in URL, check localStorage
        const sharedData = localStorage.getItem("sharedFormData");
        if (sharedData) {
          const data = JSON.parse(sharedData);
          setIsStatus(data.isStatus);
        }
      } catch (error) {
        console.error("Error retrieving shared form data:", error);
      }
    };

    getSharedFormData();
  }, [searchParams]);

  // Add keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl key is pressed
      if (event.ctrlKey) {
        switch (event.key) {
          case "F7":
            event.preventDefault();
            setIsStatus("SalesOrder");
            break;
          case "F8":
            event.preventDefault();
            setIsStatus("Invoice");
            break;
          case "F9":
            event.preventDefault();
            setIsStatus("Quote");
            break;
          case "F10":
            event.preventDefault();
            setIsStatus("PurchaseOrder");
            break;
          case "F11":
            event.preventDefault();
            setIsStatus("Bill");
            break;
          default:
            break;
        }
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array since we don't need to re-run this effect

  return <AccountingVoucherCreation isStatus={isStatus} />;
};

export default Page;
