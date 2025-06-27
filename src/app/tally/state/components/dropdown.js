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
}) {
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
              <button style={styles.newButton}>{buttonText}</button>
            </div>
          </div>
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

const styles = {
  dropdownContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  dropdownField: {
    backgroundColor: '#ffeeb0',
    border: '1px solid #aaa',
    padding: '2px 5px',
    width: '200px',
    cursor: 'pointer',
    marginLeft: '5px',
  },
  listPanel: {
    position: 'fixed',
    top: 0,
    right: '250px',
    width: '300px',
    height: '100vh',
    backgroundColor: 'white',
    border: '1px solid #2c5898',
    zIndex: 90,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c5898',
    color: 'white',
    padding: '5px 10px',
    fontWeight: 'bold',
  },
  newButton: {
    backgroundColor: 'white',
    border: 'none',
    padding: '2px 8px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  searchInput: {
    width: '100%',
    padding: '5px',
    border: 'none',
    borderBottom: '1px solid #ccc',
    outline: 'none',
  },
  listContent: {
    overflowY: 'auto',
    flex: '1',
  },
  listItem: {
    padding: '5px 15px',
    cursor: 'pointer',
    position: 'relative',
    fontSize: '14px',
  },
  selectedItem: {
    backgroundColor: '#ffc000',
  },
  bulletPoint: {
    position: 'absolute',
    left: '5px',
    color: 'black',
  }
};