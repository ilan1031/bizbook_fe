// import React from "react";
// import { Box, Typography } from "@mui/material";

// const GatewayMenu = ({ onCreateClick, onVouchersClick }) => {
//   const menuSections = [
//     {
//       title: "MASTERS",
//       items: [
//         { label: "Create", highlight: true, onClick: onCreateClick },
//         { label: "Alter" },
//         { label: "Chart of Accounts" }
//       ]
//     },
//     {
//       title: "TRANSACTIONS",
//       items: [
//         { label: "Vouchers", onClick: onVouchersClick },
//         { label: "Saved Vouchers" },
//         { label: "Day Book" }
//       ]
//     },
//     {
//       title: "UTILITIES",
//       items: [
//         { label: "Banking" }
//       ]
//     },
//     {
//       title: "REPORTS",
//       items: [
//         { label: "Balance Sheet" },
//         { label: "Profit & Loss A/c" },
//         { label: "Stock Summary" },
//         { label: "Ratio Analysis" },
//         { label: "Display More Reports" },
//         { label: "Dashboard" }
//       ]
//     }
//   ];

//   return (
//     <Box
//       sx={{
//         width: "30%",
//         height: "100%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "flex-start",
//         padding: "24px 8px 0 8px",
//         backgroundColor: "#e6f2ff",
//       }}
//     >
//       <Box
//         sx={{
//           width: "280px",
//           backgroundColor: "#e6f2ff",
//           border: "1px solid #a0a0a0",
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             backgroundColor: "#4682B4",
//             color: "white",
//             padding: "6px 0",
//             textAlign: "center",
//             fontWeight: "bold",
//             fontSize: "16px",
//           }}
//         >
//           Gateway of Tally
//         </Box>

//         {/* Menu Sections */}
//         {menuSections.map((section, sectionIndex) => (
//           <React.Fragment key={section.title}>
//             {/* Section Header */}
//             <Box
//               sx={{
//                 backgroundColor: "#e6f2ff",
//                 color: "#666",
//                 padding: "4px 0",
//                 textAlign: "center",
//                 fontSize: "12px",
//               }}
//             >
//               {section.title}
//             </Box>

//             {/* Section Items */}
//             {section.items.map((item, itemIndex) => (
//               <Box
//                 key={`${section.title}-${item.label}`}
//                 sx={{
//                   backgroundColor: item.highlight ? "#FFD700" : "transparent",
//                   padding: "4px 0",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: item.highlight ? "#e0e0e0" : "#f5f5f5" },
//                 }}
//                 onClick={item.onClick}
//               >
//                 <Typography sx={{ fontSize: "14px" }}>{item.label}</Typography>
//               </Box>
//             ))}
//           </React.Fragment>
//         ))}

//         <Box sx={{ flexGrow: 1 }}></Box>

//         <Box
//           sx={{
//             padding: "6px 0",
//             textAlign: "center",
//             cursor: "pointer",
//             "&:hover": { backgroundColor: "#f5f5f5" },
//           }}
//         >
//           <Typography sx={{ fontSize: "14px" }}>Quit</Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default GatewayMenu;
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

// Define the menu structure with nested levels
const menuData = [
  {
    title: "MASTERS",
    items: [
      { label: "Create"  },
      { label: "Alter" },
      { label: "Chart of Accounts" },
    ],
  },
  {
    title: "TRANSACTIONS",
    items: [
      { label: "Vouchers", onClick: "onVouchersClick" },
      { label: "Saved Vouchers" },
      { label: "Day Book" },
    ],
  },
  {
    title: "UTILITIES",
    items: [{ label: "Banking" }],
  },
  {
    title: "REPORTS",
    items: [
      { label: "Balance Sheet" },
      { label: "Profit & Loss A/c" },
      { label: "Stock Summary" },
      { label: "Ratio Analysis" },
      {
        label: "Display More Reports",
        subMenu: [
          {
            title: "ACCOUNTING",
            items: [
              { label: "Trial Balance" },
              { label: "Day Book" },
              { label: "Cash Flow" },
              { label: "Funds Flow" },
            ],
          },
          {
            title: "ACCOUNT BOOKS",
            items: [{ label: "Statements of Accounts" }],
          },
          {
            title: "INVENTORY",
            items: [{ label: "Inventory Books" }, { label: "Statements of Inventory" }],
          },
          {
            title: "STATUTORY",
            items: [{ label: "Statutory Reports" }],
          },
          {
            title: "EXCEPTION",
            items: [
              {
                label: "Exception Reports",
                subMenu: [
                  {
                    title: "REGISTERS",
                    items: [
                      { label: "Optional Vouchers", highlight: true },
                      { label: "Cancelled Vouchers" },
                      { label: "Post-Dated Vouchers" },
                    ],
                  },
                  {
                    title: "REPORTS",
                    items: [
                      { label: "Negative Ledgers" },
                      { label: "Negative Stock" },
                      { label: "Overdue Receivables" },
                      { label: "Overdue Payable" },
                    ],
                  },
                ],
              },
              { label: "Analysis & Verification" },
            ],
          },
        ],
      },
      { label: "Dashboard" },
    ],
  },
];

const GatewayMenu = ({ onCreateClick, onVouchersClick }) => {
  const [activeMenu, setActiveMenu] = useState(menuData); // Tracks the current menu being displayed
  const [menuHistory, setMenuHistory] = useState([]); // Tracks the history of menus for navigation

  // Function to handle item clicks
  const handleItemClick = (item, section) => {
    // Handle predefined onClick functions
    if (item.label === "Create" && onCreateClick) {
      onCreateClick();
    } else if (item.label === "Vouchers" && onVouchersClick) {
      onVouchersClick();
    } else if (item.subMenu) {
      // If the item has a submenu, push the current menu to history and set the new menu
      setMenuHistory([...menuHistory, { menu: activeMenu, title: section.title }]);
      setActiveMenu(item.subMenu);
    }
  };

  // Function to handle going back to the previous menu
  const handleBack = () => {
    if (menuHistory.length > 0) {
      const previousMenu = menuHistory[menuHistory.length - 1];
      setActiveMenu(previousMenu.menu);
      setMenuHistory(menuHistory.slice(0, -1));
    }
  };

  // Function to handle Quit
  const handleQuit = () => {
    setActiveMenu(menuData); // Reset to the main menu
    setMenuHistory([]); // Clear history
  };

  // Determine the current title based on menu history
  const currentTitle =
    menuHistory.length > 0
      ? menuHistory[menuHistory.length - 1].title === "REPORTS" && activeMenu[0]?.title === "ACCOUNTING"
        ? "Display More Reports"
        : menuHistory[menuHistory.length - 1].title === "EXCEPTION" && activeMenu[0]?.title === "REGISTERS"
        ? "Exception Reports"
        : "Gateway of Tally"
      : "Gateway of Tally";

  return (
    <Box
      sx={{
        width: "30%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "24px 8px 0 8px",
        backgroundColor: "#e6f2ff",
      }}
    >
      <Box
        sx={{
          width: "280px",
          backgroundColor: "#e6f2ff",
          border: "1px solid #a0a0a0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: "#4682B4",
            color: "white",
            padding: "6px 0",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {currentTitle}
        </Box>

        {/* Menu Sections */}
        {activeMenu.map((section, sectionIndex) => (
          <React.Fragment key={section.title}>
            {/* Section Header */}
            <Box
              sx={{
                backgroundColor: "#e6f2ff",
                color: "#666",
                padding: "4px 0",
                textAlign: "center",
                fontSize: "12px",
              }}
            >
              {section.title}
            </Box>

            {/* Section Items */}
            {section.items.map((item, itemIndex) => (
              <Box
                key={`${section.title}-${item.label}`}
                sx={{
                  backgroundColor: item.highlight ? "#FFD700" : "transparent",
                  padding: "4px 0",
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: item.highlight ? "#e0e0e0" : "#f5f5f5",
                  },
                }}
                onClick={() => handleItemClick(item, section)}
              >
                <Typography sx={{ fontSize: "14px" }}>{item.label}</Typography>
              </Box>
            ))}
          </React.Fragment>
        ))}

        <Box sx={{ flexGrow: 1 }}></Box>

        {/* Quit Button */}
        <Box
          sx={{
            padding: "6px 0",
            textAlign: "center",
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
          onClick={handleQuit}
        >
          <Typography sx={{ fontSize: "14px" }}>Quit</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default GatewayMenu;