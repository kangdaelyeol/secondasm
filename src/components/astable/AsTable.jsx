import React from 'react';
import styles from './asTable.module.css';

const AsTable = ({ inform }) => {
  /*
   inform { memoryWord, symbol, hex, bin }: Object
   */
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Address-Symbol Table</h1>
      <div className={styles.table}>
        <div className={styles.tableRow}>
          <span className={styles.subTitle}>MemoryWord</span>
          {Object.keys(inform).map((index) => {
            const item = inform[index].memoryWord;
            return <span className={styles.val}>{item}</span>;
          })}
        </div>
        <div className={styles.tableRow}>
          <span className={styles.subTitle}>Symbol</span>
          {Object.keys(inform).map((index) => {
            const item = inform[index].symbol;
            return <span className={styles.val}>{item}</span>;
          })}
        </div>
        <div className={styles.tableRow}>
          <span className={styles.subTitle}>Hex</span>
          {Object.keys(inform).map((index) => {
            const item = inform[index].hex;
            return <span className={styles.val}>{item}</span>;
          })}
        </div>
        <div className={styles.tableRow}>
          <span className={styles.subTitle}>Bin-op</span>
          {Object.keys(inform).map((index) => {
            const item = inform[index].bin;
            return <span className={styles.val}>{item}</span>;
          })}
        </div>
      </div>
    </div>
  );
};

export default AsTable;
