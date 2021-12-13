import React, { useRef } from 'react';
import styles from './sinput.module.css';
import { firstPass, secondPass } from '../assemblrLogic/assemblr';

const Sinput = () => {
  const textareaRef = useRef();
  const onBtnClick = (event) => {
    event.preventDefault();
    const st = textareaRef.current.value;
    const { result, list } = firstPass(st);
    const secondResult = secondPass(st, list);

    // result -> address-symbol table
    console.log(result);

    //secondResult -> binary instruction table
    console.log(secondResult);
  };

  return (
    <div className={styles.main}>
      <textarea cols={50} rows={30} ref={textareaRef}></textarea>
      <button onClick={onBtnClick}>start!</button>
    </div>
  );
};

export default Sinput;
