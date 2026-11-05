"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function EInvoiceDetails(_props?: any) {
  const router = useRouter(); // Initialize the router
  const [billToPlace, setBillToPlace] = useState<any>('');
  const [shipToPlace, setShipToPlace] = useState<any>('');
  const [ackNo, setAckNo] = useState<any>('');
  const [ackDate, setAckDate] = useState<any>('');
  const [irn, setIrn] = useState<any>('');

  const handleShipToPlaceChange = (e) => {
    setShipToPlace((e.target as any).value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Navigate to the "voucher" page when Enter is pressed
      router.push('/tally/voucher');
    }
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>e-Invoice Details</title>
        <meta name="description" content="e-Invoice details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={styles.pageContainer}>
        <div style={styles.mainContent}>
          <div style={styles.invoiceDetailsContainer}>
            <div style={styles.invoiceDetailsHeader}>
              e-Invoice Details
            </div>
            
            <div style={styles.invoiceDetailsContent}>
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>Ack No.</div>
                <div style={styles.detailColon}>:</div>
                <div style={styles.detailValue}>
                  <input 
                    type="text" 
                    value={ackNo}
                    onChange={(e) => setAckNo((e.target as any).value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.detailLabel}>Ack Date</div>
                <div style={styles.detailColon}>:</div>
                <div style={styles.detailValue}>
                  <input 
                    type="text" 
                    value={ackDate}
                    onChange={(e) => setAckDate((e.target as any).value)}
                    style={styles.input}
                  />
                </div>
              </div>
              
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>IRN</div>
                <div style={styles.detailColon}>:</div>
                <div style={styles.detailValueWide}>
                  <input 
                    type="text" 
                    value={irn}
                    onChange={(e) => setIrn((e.target as any).value)}
                    style={styles.input}
                  />
                </div>
              </div>
              
              <div style={styles.placeHeader}>Place of Party</div>
              
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>Bill to place</div>
                <div style={styles.detailColon}>:</div>
                <div style={styles.detailValue}>
                  <input 
                    type="text" 
                    value={billToPlace}
                    onChange={(e) => setBillToPlace((e.target as any).value)}
                    style={{...styles.input, backgroundColor: '#ffeeb0'}}
                  />
                </div>
              </div>
              
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>Ship to place</div>
                <div style={styles.detailColon}>:</div>
                <div style={styles.detailValue}>
                  <input 
                    type="text" 
                    value={shipToPlace}
                    onChange={handleShipToPlaceChange} // Call the new function
                    onKeyDown={handleKeyDown} // Call the key down handler
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.sidebar}>
          {/* Empty sidebar with blue color, now on the right */}
        </div>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    fontFamily: 'Arial, sans-serif' as const,
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
    position: 'relative' as const,
  },
  pageContainer: {
    display: 'flex' as const,
    minHeight: '100vh',
  },
  sidebar: {
    width: '250px',
    background: '#8ecae6',
    boxShadow: '-2px 0 5px rgba(0,0,0,0.2)',
  },
  mainContent: {
    flex: '1',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: '20px',
  },
  invoiceDetailsContainer: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #aaa',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  invoiceDetailsHeader: {
    textAlign: 'center' as const,
    fontWeight: 'bold' as const,
    padding: '10px',
    borderBottom: '1px solid #aaa',
    backgroundColor: '#f5f5f5',
  },
  invoiceDetailsContent: {
    padding: '15px',
  },
  placeHeader: {
    fontWeight: 'bold' as const,
    marginTop: '15px',
    marginBottom: '5px',
  },
  detailRow: {
    display: 'flex' as const,
    margin: '5px 0',
    alignItems: 'center' as const,
  },
  detailLabel: {
    width: '100px',
    textAlign: 'left' as const,
  },
  detailColon: {
    width: '10px',
    textAlign: 'center' as const,
  },
  detailValue: {
    width: '180px',
    marginRight: '20px',
  },
  detailValueWide: {
    flex: '1',
  },
  input: {
    width: '100%',
    padding: '2px 5px',
    border: '1px solid #aaa',
    outline: 'none',
  },
};