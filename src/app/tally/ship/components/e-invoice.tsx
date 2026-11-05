// Layout Components
// components/Layout.jsx
"use client";
import React from 'react';
import Head from 'next/head';

export default function Layout({ children, title, description }: any) {
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
};