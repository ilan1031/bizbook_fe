"use client";
import React, { useRef } from 'react';

export default function Dropdown({ 
  isOpen, 
  toggle, 
  selected, 
  onSelect, 
  options, 
  title, 
  buttonText,
  searchTerm,
  setSearchTerm,
  filterFunction
}: any) {
  const filteredOptions = searchTerm && filterFunction 
    ? filterFunction(searchTerm, options)
    : options;

  return (
    <div style={styles.dropdownContainer}>
      <div 
        style={styles.dropdownField}
        onClick={toggle}
      >
        {selected}
      </div>
      
      {isOpen && (
        <div style={styles.listPanel}>
          <div style={styles.listHeader}>
            <div>{title}</div>
            <div style={{marginRight: '15px'}}>
              
            </div>
          </div>
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm((e.target as any).value)}
            style={styles.searchInput}
            placeholder={`Search ${title.toLowerCase()}...`}
            autoFocus
          />
          
          <div style={styles.listContent}>
            {filteredOptions.map((option, index) => (
              <div 
                key={index}
                style={{
                  ...styles.listItem,
                  ...(option === selected ? styles.selectedItem : {})
                }}
                onClick={() => onSelect(option)}
              >
                {option === selected && <span style={styles.bulletPoint}>&#8226;</span>}
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles: any = {
  dropdownContainer: {
    position: 'relative' as const,
    display: 'inline-block' as const,
  },
  dropdownField: {
    backgroundColor: '#ffeeb0',
    border: '1px solid #aaa',
    padding: '2px 5px',
    width: '200px',
    cursor: 'pointer' as const,
    marginLeft: '5px',
  },
  listPanel: {
    position: 'fixed' as const,
    top: 0,
    right: '250px',
    width: '300px',
    height: '100vh',
    backgroundColor: 'white',
    border: '1px solid #2c5898',
    zIndex: 90,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  listHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    backgroundColor: '#2c5898',
    color: 'white',
    padding: '5px 10px',
    fontWeight: 'bold' as const,
  },
  newButton: {
    backgroundColor: 'white',
    border: 'none',
    padding: '2px 8px',
    fontSize: '12px',
    cursor: 'pointer' as const,
  },
  searchInput: {
    width: '100%',
    padding: '5px',
    border: 'none',
    borderBottom: '1px solid #ccc',
    outline: 'none',
  },
  listContent: {
    overflowY: 'auto' as const,
    flex: '1',
  },
  listItem: {
    padding: '5px 15px',
    cursor: 'pointer' as const,
    position: 'relative' as const,
    fontSize: '14px',
  },
  selectedItem: {
    backgroundColor: '#ffc000',
  },
  bulletPoint: {
    position: 'absolute' as const,
    left: '5px',
    color: 'black',
  }
};