"use client";
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import Header from "../../state/components/header";
import Footer from "../../state/components/footer";
import PartyDetails from "../../state/components/partydetails";
import { indianStates, countries, filterOptions } from "../constants/data";

export default function Home() {
  const router = useRouter();
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isSupplyOpen, setIsSupplyOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("Karnataka");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedSupply, setSelectedSupply] = useState("Karnataka");
  const [searchTerm, setSearchTerm] = useState("");
  const stateDropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const supplyDropdownRef = useRef(null);

  const filteredStates = filterOptions(searchTerm, indianStates);
  const filteredCountries = filterOptions(searchTerm, countries);

  const toggleStateDropdown = () => {
    setIsStateOpen(!isStateOpen);
    setIsCountryOpen(false);
    setIsSupplyOpen(false);
    if (!isStateOpen) {
      setSearchTerm("");
    }
  };

  const toggleCountryDropdown = () => {
    setIsCountryOpen(!isCountryOpen);
    setIsStateOpen(false);
    setIsSupplyOpen(false);
    if (!isCountryOpen) {
      setSearchTerm("");
    }
  };

  const toggleSupplyDropdown = () => {
    setIsSupplyOpen(!isSupplyOpen);
    setIsStateOpen(false);
    setIsCountryOpen(false);
    if (!isSupplyOpen) {
      setSearchTerm("");
    }
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
    router.push("/voucher");
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
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addressContent = "No. 28, Hongasandra\nHosur Main Road\nBangalore";

  return (
    <div style={styles.container}>
      <Head>
        <title>Party Details - National Enterprises</title>
        <meta name="description" content="State selection component" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header title="Party Details" companyName="National Enterprises" />

      <div style={styles.pageContainer}>
        <div style={styles.mainContent}>
          <PartyDetails
            buyerName="Ganeshji Industries"
            mailingName="Ganeshji Industries"
            address={addressContent}
            selectedState={selectedState}
            selectedCountry={selectedCountry}
            selectedSupply={selectedSupply}
            isStateOpen={isStateOpen}
            isCountryOpen={isCountryOpen}
            isSupplyOpen={isSupplyOpen}
            toggleStateDropdown={toggleStateDropdown}
            toggleCountryDropdown={toggleCountryDropdown}
            toggleSupplyDropdown={toggleSupplyDropdown}
            selectState={selectState}
            selectCountry={selectCountry}
            selectSupply={selectSupply}
            filteredStates={filteredStates}
            filteredCountries={filteredCountries}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            stateDropdownRef={stateDropdownRef}
            countryDropdownRef={countryDropdownRef}
            supplyDropdownRef={supplyDropdownRef}
            gstin="29AIFPD2613R1Z0"
          />
        </div>

        <div style={styles.sidebar}>{/* Sidebar content goes here */}</div>
      </div>

      <Footer referenceText="" configText="F12: Configure" />
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f0f0",
    // minHeight: '100vh',
    position: "relative",
  },
  pageContainer: {
    display: "flex",
    // minHeight: 'calc(100vh - 70px)',
  },
  mainContent: {
    flex: "1",
    padding: "20px",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#8ecae6",
    borderLeft: " #8ecae6",
  },
};
