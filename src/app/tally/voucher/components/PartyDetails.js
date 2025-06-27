"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import DetailRow from "../../state/components/detailrow";
import Dropdown from "../../state/components/dropdown";

const PartyDetails = ({ onClose, contactDetails, selectedAccount }) => {
  const router = useRouter();
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isSupplyOpen, setIsSupplyOpen] = useState(false);
  const [isGstTypeOpen, setIsGstTypeOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("Karnataka");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedSupply, setSelectedSupply] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [gstRegistrationType, setGstRegistrationType] = useState("Regular");

  const stateDropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const supplyDropdownRef = useRef(null);
  const gstTypeDropdownRef = useRef(null);

  // Initialize selected state and supply from contact details
  useEffect(() => {
    if (contactDetails && contactDetails.place_of_contact) {
      setSelectedState(contactDetails.place_of_contact);
      setSelectedSupply(contactDetails.place_of_contact);
    } else {
      setSelectedSupply("Select State");
    }
  }, [contactDetails]);

  const indianStates = [
    "Not Applicable",
    "Andaman & Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra & Nagar Haveli and Daman & Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu & Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Other Territory",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal",
  ];

  const countries = [
    "India",
    "Afghanistan",
    "Australia",
    "Bangladesh",
    "Bhutan",
    "China",
    "Japan",
    "Malaysia",
    "Nepal",
    "Singapore",
    "Sri Lanka",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
  ];

  const gstRegistrationTypes = [
    "Regular",
    "Composition",
    "Unregistered",
    "Consumer",
    "OIDAR",
  ];

  const filteredStates = searchTerm
    ? indianStates.filter((state) =>
        state.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : indianStates;

  const filteredCountries = searchTerm
    ? countries.filter((country) =>
        country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : countries;

  const toggleStateDropdown = () => {
    setIsStateOpen(!isStateOpen);
    setIsCountryOpen(false);
    setIsSupplyOpen(false);
    setIsGstTypeOpen(false);
    if (!isStateOpen) {
      setSearchTerm("");
    }
  };

  const toggleCountryDropdown = () => {
    setIsCountryOpen(!isCountryOpen);
    setIsStateOpen(false);
    setIsSupplyOpen(false);
    setIsGstTypeOpen(false);
    if (!isCountryOpen) {
      setSearchTerm("");
    }
  };

  const toggleSupplyDropdown = () => {
    setIsSupplyOpen(!isSupplyOpen);
    setIsStateOpen(false);
    setIsCountryOpen(false);
    setIsGstTypeOpen(false);
    if (!isSupplyOpen) {
      setSearchTerm("");
    }
  };

  const toggleGstTypeDropdown = () => {
    setIsGstTypeOpen(!isGstTypeOpen);
    setIsStateOpen(false);
    setIsCountryOpen(false);
    setIsSupplyOpen(false);
  };

  const selectState = (state) => {
    setSelectedState(state);
    setIsStateOpen(false);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setIsCountryOpen(false);
  };

  const selectSupply = (state) => {
    setSelectedSupply(state);
    setIsSupplyOpen(false);
    onClose(); // Close popup when place of supply is selected

    // Store the selected state in localStorage for the voucher page
    localStorage.setItem("selectedPartyName", state);
  };

  const selectGstType = (type) => {
    setGstRegistrationType(type);
    setIsGstTypeOpen(false);
  };

  const handleClickOutside = (event) => {
    if (
      stateDropdownRef.current &&
      !stateDropdownRef.current.contains(event.target)
    ) {
      setIsStateOpen(false);
    }
    if (
      countryDropdownRef.current &&
      !countryDropdownRef.current.contains(event.target)
    ) {
      setIsCountryOpen(false);
    }
    if (
      supplyDropdownRef.current &&
      !supplyDropdownRef.current.contains(event.target)
    ) {
      setIsSupplyOpen(false);
    }
    if (
      gstTypeDropdownRef.current &&
      !gstTypeDropdownRef.current.contains(event.target)
    ) {
      setIsGstTypeOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (contactDetails === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.partyDetailsContainer}>
      <div style={styles.partyDetailsHeader}>
        <div style={styles.partyDetailsTitle}>Party Details</div>
      </div>

      <div style={styles.partyDetailsContent}>
        <DetailRow label="Buyer (Bill to)">
          {selectedAccount ||
            contactDetails.company_name ||
            "Ganeshji Industries"}
        </DetailRow>

        <DetailRow label="Mailing Name">
          {selectedAccount ||
            contactDetails.company_name ||
            "Ganeshji Industries"}
        </DetailRow>

        <DetailRow label="Address">
          <div>
            {contactDetails.billing_address ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  paddingLeft: "4px",
                }}
              >
                {[
                  contactDetails.billing_address.attention,
                  contactDetails.billing_address.address,
                  contactDetails.billing_address.street2,
                  contactDetails.billing_address.city,
                  [
                    contactDetails.billing_address.state,
                    contactDetails.billing_address.zip,
                  ]
                    .filter(Boolean)
                    .join(" "),
                  contactDetails.billing_address.country,
                  contactDetails.billing_address.phone
                    ? `Phone ${contactDetails.billing_address.phone}`
                    : null,
                  contactDetails.billing_address.fax
                    ? `Fax Number ${contactDetails.billing_address.fax}`
                    : null,
                ]
                  .filter(Boolean)
                  .map((line, index) => (
                    <div
                      key={index}
                      style={{
                        fontWeight: index === 0 ? "bold" : "normal",
                        lineHeight: "1.5",
                      }}
                    >
                      {line}
                    </div>
                  ))}
              </div>
            ) : (
              "No. 28, Hongasandra\nHosur Main Road\nBangalore"
            )}
          </div>
        </DetailRow>

        <DetailRow label="State">
          <div ref={stateDropdownRef}>
            <Dropdown
              isOpen={isStateOpen}
              toggle={toggleStateDropdown}
              selected={selectedState}
              onSelect={selectState}
              options={filteredStates}
              title="List of States"
              buttonText="New State"
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </DetailRow>

        <DetailRow label="Country">
          <div ref={countryDropdownRef}>
            <Dropdown
              isOpen={isCountryOpen}
              toggle={toggleCountryDropdown}
              selected={selectedCountry}
              onSelect={selectCountry}
              options={filteredCountries}
              title="List of Countries"
              buttonText="New Country"
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </DetailRow>

        <DetailRow label="GST Registration Type">
          {contactDetails.contact_type || ""}
        </DetailRow>

        <DetailRow label="GSTIN/UIN">{contactDetails.gst_no || ""}</DetailRow>

        <div style={styles.divider}></div>

        <DetailRow label="Place of Supply">
          <div ref={supplyDropdownRef}>
            <Dropdown
              isOpen={isSupplyOpen}
              toggle={toggleSupplyDropdown}
              selected={selectedSupply}
              onSelect={selectSupply}
              options={filteredStates}
              title="List of States"
              buttonText="New State"
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </DetailRow>
      </div>
    </div>
  );
};

const styles = {
  partyDetailsContainer: {
    width: "100%",
    maxWidth: "480px",
    margin: "0 auto",
    border: "1px solid #aaa",
    backgroundColor: "white",
    border: "1px solid black",
  },
  partyDetailsHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "10px",
  },
  partyDetailsTitle: {
    textAlign: "center",
    fontWeight: "bold",
    textDecoration: "underline",
  },
  partyDetailsContent: {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingBottom: "4px",
  },
  divider: {
    height: "1px",
    backgroundColor: "#ddd",
    margin: "8px 0",
  },
};

export default PartyDetails;
