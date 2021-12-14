import React, { useRef, useState } from 'react';
import styles from './sinput.module.css';
import { firstPass, secondPass } from '../assemblrLogic/assemblr';
import AsTable from '../astable/AsTable';
import InstructionTable from '../instructionTable/InstructionTable';

const Sinput = () => {
  const textareaRef = useRef();
  const [tables, setTables] = useState({
    address_symbol_Table: false,
    instruction_Table: false,
    isError: false,
    process:false
  });
  const onBtnClick = (event) => {
    event.preventDefault();
    const st = textareaRef.current.value;
    try {
      const { result, list } = firstPass(st);
      const secondResult = secondPass(st, list);
      // result -> address-symbol table
      console.log('address-symbol table', result);
  
      //secondResult -> binary instruction table
      console.log('second-pass Table', secondResult);
      setTables({
        ...tables,
        instruction_Table: secondResult,
        address_symbol_Table: result,
        isError: false,
        process:true
      })
    } catch(e){
      setTables({
        ...tables,
        isError: e.message
      })
      console.log(e);
    }

  };

  return (
    <div className={styles.main}>
      {tables.isError && <h1>{tables.isError}</h1>}
      <h3 className={styles.title}>Source Code</h3>
      <div className={styles.source}>
        <textarea cols={35} rows={30} ref={textareaRef}></textarea>
        <button className={styles.btn} onClick={onBtnClick}>start!</button>
      </div>
      {tables.process &&
      <div className={styles.tableSet}>
        <div className={styles.table}>
          <AsTable inform={tables.address_symbol_Table}/>
        </div>
        <div className={styles.table}>
          <InstructionTable inform={tables.instruction_Table} />
        </div>
      </div> 
      }
    </div>
  );
};

export default Sinput;
