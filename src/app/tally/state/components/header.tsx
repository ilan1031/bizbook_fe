"use client";
import React from 'react';

export default function Header({ title, companyName }: any) {
  return (
    <div style={styles.topBar}>
      <div style={styles.leftHeader}>{title}</div>
      <div style={styles.rightHeader}>{companyName}</div>
    </div>
  );
}

const styles: any = {
  topBar: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: '#8ecae6',
    color: 'white',
    padding: '4px 10px',
  },
  leftHeader: {
    fontWeight: 'bold' as const,
  },
  rightHeader: {
    fontWeight: 'bold' as const,
  }
};