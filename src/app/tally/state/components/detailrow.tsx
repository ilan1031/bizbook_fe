"use client";
import React from 'react';

export default function DetailRow({ label, children }: any) {
  return (
    <div style={styles.detailRow}>
      <div style={styles.detailLabel}>{label}</div>
      <div style={styles.detailValue}>
        : {children}
      </div>
    </div>
  );
}

const styles: any = {
  detailRow: {
    display: 'flex' as const,
    margin: '5px 0',
    position: 'relative' as const,
  },
  detailLabel: {
    width: '120px',
    textAlign: 'right' as const,
    paddingRight: '10px',
    fontWeight: 'normal' as const,
  },
  detailValue: {
    flex: '1',
    display: 'flex' as const,
    alignItems: 'center' as const,
    position: 'relative' as const,
  }
};