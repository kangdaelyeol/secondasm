import React from "react";
import styles from "./instructionTable.module.css"
const InstructionTable = ({ inform }) => {
  // instruction Table -> LC, instruction

  return(<div className={styles.main}>
     <h3 className={styles.title}>Instuction Table</h3>
     <div className={styles.table}>
       <div className={styles.tableRow}>
         <span className={styles.subTitle}>LC</span>
         {Object.keys(inform).map(item => {
           return <span className={styles.item}>{inform[item].LC}</span>
         })}
       </div>
       <div className={styles.tableRow}>
         <span className={styles.subTitle}>Instruction</span>
         {Object.keys(inform).map(item => {
           return <span className={styles.item}>{inform[item].instruction}</span>
         })}
       </div>
     </div>
  </div>)
}


export default InstructionTable;