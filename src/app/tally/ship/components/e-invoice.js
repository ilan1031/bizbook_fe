// Layout Components
// components/Layout.jsx
"use client";
import React from 'react';
import Head from 'next/head';

export default function Layout({ children, title, description }) {
  return (
    <div style={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={styles.pageContainer}>
        <div style={styles.mainContent}>
          {children}
        </div>
        
        <div style={styles.sidebar}>
          {/* Empty sidebar with blue color */}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
    position: 'relative',
  },
  pageContainer: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '250px',
    background: '#8ecae6',
    boxShadow: '-2px 0 5px rgba(0,0,0,0.2)',
  },
  mainContent: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
};