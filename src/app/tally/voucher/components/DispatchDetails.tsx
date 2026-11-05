"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PartyDetails from "./PartyDetails";
import apiService from "../../../../services/axiosService";

const DispatchDetails = ({
  deliveryNotes,
  dispatchDoc,
  dispatchedThrough,
  destination,
  carrierName,
  billNumber,
  billDate,
  vehicleNumber,
  onDeliveryNotesChange,
  onDispatchDocChange,
  onDispatchedThroughChange,
  onDestinationChange,
  onCarrierNameChange,
  onBillNumberChange,
  onBillDateChange,
  onVehicleNumberChange,
  onClose,
  onVehicleNumberEnter,
}: any) => {
  const router = useRouter();
  const [showPartyDetails, setShowPartyDetails] = useState<boolean>(false);
  const [headerTitle, setHeaderTitle] = useState("Dispatch Details");
  const [contactDetails, setContactDetails] = useState<any>(null);
  const [contactLoading, setContactLoading] = useState<boolean>(false);
  const organization_id = localStorage.getItem("organization_id");

  // Fetch contact details when PartyDetails popup is opened
  useEffect(() => {
    if (showPartyDetails) {
      fetchContactDetails();
    }
  }, [showPartyDetails]);

  // Function to fetch contact details
  const fetchContactDetails = async () => {
    setContactLoading(true);
    try {
      const contactId = localStorage.getItem("selectedContactId");
      if (!contactId) {
        setContactLoading(false);
        return;
      }

      const response = await apiService({
        method: "GET",
        url: `/api/v1/contact/${contactId}`,
        params: {
          organization_id: organization_id,
        },
        file: false,
      });

      const { data } = response.data;
      setContactDetails(data);
      setContactLoading(false);
    } catch (error) {
      console.error("Failed to fetch contact details:", error);
      setContactLoading(false);
    }
  };

  const handleVehicleNumberKeyDown = (e) => {
    if (e.key === "Enter") {
      const vehicleNumber = (e.target as any).value;
      // Call the parent component's function to handle the Enter key press
      onVehicleNumberEnter(vehicleNumber);
    }
  };

  // Function to close party details popup
  const handleClosePartyDetails = () => {
    setShowPartyDetails(false);
    setHeaderTitle("Dispatch Details");
  };

  const styles: any = {
    container: {
      position: "absolute" as const,
      top: "30px",
      left: "0",
      right: "240px",
      bottom: "0",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      zIndex: 100,
    },
    content: {
      backgroundColor: "white",
      width: "100%",
      maxWidth: "1000px",
      margin: "0 auto",
      display: "flex" as const,
      flexDirection: "column" as const,
      border: "1px solid black",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
    title: {
      fontWeight: "bold" as const,
      fontSize: "16px",
      textAlign: "center" as const,
      padding: "10px 0",
      textDecoration: "underline" as const,
      marginBottom: "10px",
    },
    header: {
      fontWeight: "bold" as const,
      marginBottom: "10px",
      textAlign: "center" as const,
      borderBottom: "1px solid #ccc",
      paddingBottom: "5px",
    },
    row: {
      display: "flex" as const,
      marginBottom: "8px",
      alignItems: "center" as const,
      padding: "0 10px",
    },
    label: {
      width: "180px",
      textAlign: "right" as const,
      paddingRight: "10px",
      fontSize: "14px",
    },
    colon: {
      margin: "0 8px",
    },
    input: {
      padding: "2px 5px",
      border: "1px solid #ccc",
      width: "150px",
      height: "20px",
    },
    dateInput: {
      padding: "2px 5px",
      border: "1px solid #ccc",
      width: "150px",
      height: "20px",
    },
    rightSection: {
      marginLeft: "20px",
      flex: 1,
    },
    rightLabel: {
      width: "150px",
      textAlign: "right" as const,
      paddingRight: "10px",
      fontSize: "14px",
    },
    flexContainer: {
      display: "flex" as const,
      justifyContent: "space-between" as const,
      padding: "10px",
    },
    leftSection: {
      flex: 1,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.title}>Dispatch Details</div>
        <div style={styles.flexContainer}>
          <div style={styles.leftSection}>
            <div style={styles.row}>
              <div style={styles.label}>Delivery Note No(s)</div>
              <span style={styles.colon}>:</span>
              <input
                type="text"
                value={deliveryNotes}
                onChange={(e) => onDeliveryNotesChange((e.target as any).value)}
                style={styles.input}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.label}>Date</div>
              <span style={styles.colon}>:</span>
              <input
                type="date"
                value={billDate}
                onChange={(e) => onBillDateChange((e.target as any).value)}
                style={styles.dateInput}
              />
            </div>
          </div>
          <div style={styles.rightSection}>
            <div style={styles.row}>
              <div style={styles.rightLabel}>Dispatch Doc. No.</div>
              <span style={styles.colon}>:</span>
              <input
                type="text"
                value={dispatchDoc}
                onChange={(e) => onDispatchDocChange((e.target as any).value)}
                style={styles.input}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.rightLabel}>Dispatched through</div>
              <span style={styles.colon}>:</span>
              <input
                type="text"
                value={dispatchedThrough}
                onChange={(e) => onDispatchedThroughChange((e.target as any).value)}
                style={styles.input}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.rightLabel}>Destination</div>
              <span style={styles.colon}>:</span>
              <input
                type="text"
                value={destination}
                onChange={(e) => onDestinationChange((e.target as any).value)}
                style={styles.input}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.rightLabel}>Carrier Name/Agent</div>
              <span style={styles.colon}>:</span>
              <input
                type="text"
                value={carrierName}
                onChange={(e) => onCarrierNameChange((e.target as any).value)}
                style={styles.input}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.rightLabel}>Bill of Lading/LR-RR No.</div>
              <span style={styles.colon}>:</span>
              <input
                type="text"
                value={billNumber}
                onChange={(e) => onBillNumberChange((e.target as any).value)}
                style={styles.input}
              />
              <span style={styles.colon}>Date:</span>
              <input
                type="date"
                value={billDate}
                onChange={(e) => onBillDateChange((e.target as any).value)}
                style={styles.dateInput}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.rightLabel}>Vehicle No.</div>
              <span style={styles.colon}>:</span>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => onVehicleNumberChange((e.target as any).value)}
                onKeyDown={handleVehicleNumberKeyDown}
                style={styles.input}
              />
            </div>
          </div>
        </div>
      </div>

      {/* PartyDetails Popup */}
      {showPartyDetails && (
        <div
          style={{
            position: "absolute" as const,
            top: "60px",
            left: "0",
            right: "240px",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex" as const,
            justifyContent: "center" as const,
            alignItems: "center" as const,
            zIndex: 100,
          }}
        >
          <PartyDetails
            contactDetails={contactDetails}
            loading={contactLoading}
          />
        </div>
      )}
    </div>
  );
};

export default DispatchDetails;
