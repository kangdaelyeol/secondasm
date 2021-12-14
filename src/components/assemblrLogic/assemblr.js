// const SAMPLE_STRING = "org 150\nsta min\nsub maxmin, dec 100\nmax, hex 150min, dec 100\nmax, hex 150min, dec 100\nmax, hex 150"
const InstructionTable = {
  AND: {
    kind: 'MRI',
    hex: 0,
  },
  ADD: {
    kind: 'MRI',
    hex: 1,
  },
  LDA: {
    kind: 'MRI',
    hex: 2,
  },
  STA: {
    kind: 'MRI',
    hex: 3,
  },
  BUN: {
    kind: 'MRI',
    hex: 4,
  },
  BSA: {
    kind: 'MRI',
    hex: 5,
  },
  ISZ: {
    kind: 'MRI',
    hex: 6,
  },
  CLA: {
    kind: 'non-MRI',
    hex: HexToBin16('7800', 4),
  },
  CLE: {
    kind: 'non-MRI',
    hex: HexToBin16('7400', 4),
  },
  CMA: {
    kind: 'non-MRI',
    hex: HexToBin16('7200', 4),
  },
  CME: {
    kind: 'non-MRI',
    hex: HexToBin16('7100', 4),
  },
  CIR: {
    kind: 'non-MRI',
    hex: HexToBin16('7080', 4),
  },
  CIL: {
    kind: 'non-MRI',
    hex: HexToBin16('7040', 4),
  },
  INC: {
    kind: 'non-MRI',
    hex: HexToBin16('7020', 4),
  },
  SPA: {
    kind: 'non-MRI',
    hex: HexToBin16('7010', 4),
  },
  SNA: {
    kind: 'non-MRI',
    hex: HexToBin16('7008', 4),
  },
  SZA: {
    kind: 'non-MRI',
    hex: HexToBin16('7004', 4),
  },
  SZE: {
    kind: 'non-MRI',
    hex: HexToBin16('7002', 4),
  },
  HLT: {
    kind: 'non-MRI',
    hex: HexToBin16('7001', 4),
  },
  INP: {
    kind: 'non-MRI',
    hex: HexToBin16('F800', 4),
  },
  OUT: {
    kind: 'non-MRI',
    hex: HexToBin16('F400', 4),
  },
  SKI: {
    kind: 'non-MRI',
    hex: HexToBin16('F200', 4),
  },
  SKO: {
    kind: 'non-MRI',
    hex: HexToBin16('F100', 4),
  },
  ION: {
    kind: 'non-MRI',
    hex: HexToBin16('F080', 4),
  },
  IOF: {
    kind: 'non-MRI',
    hex: HexToBin16('F040', 4),
  },
};

export const secondPass = (string, list) => {
  let LC = 0;
  // list: Object
  // data Type
  // LC: int
  // operand: binary 4 * 4
  const lists = {};

  let isEnd = false;
  const lines = string.split('\n');
  lines.forEach((line) => {
    if (isEnd) return;
    const newLine = line.replaceAll(' ', '').toUpperCase();
    const inst = newLine.slice(0, 3);
    // Label인 경우 값 저장
    if (newLine.includes(',')) {
      let lcVal = 0;

      // LC 값 찾기
      Object.keys(list).forEach((item) => {
        if (list[item].LC === LC) lcVal = item;
      });

      // LC 못찾으면
      if (lcVal === 0) callError('type of lcVal');

      const operand =
        '0000' + ' ' + HexToBin16(list[lcVal].value.toString(), 3);
      lists[LC] = {
        LC,
        instruction: operand,
      };
      LC++;
      return;
    }

    // pseudo code
    if (inst === 'ORG') {
      // ORG인 경우
      LC = parseInt(newLine.slice(3));
      return;
    } else if (inst === 'END') {
      // END인 경우
      isEnd = true;
      return;
    }

    // 존재하지 않는 명령어
    if (!InstructionTable[inst]) callError('Table에서 조회되지 않는 명령어');

    // MRI
    if (InstructionTable[inst].kind === 'MRI') {
      // 명령어 부분 자르기
      const MRI_Operand = newLine.slice(3);
      console.log(`MRI_Operand: ${MRI_Operand}`);
      console.log('list:', list);
      let lcVal = 0;

      // LC 값 찾기
      Object.keys(list).forEach((item) => {
        if (list[item].label === MRI_Operand) lcVal = list[item].LC;
      });

      // LC 못찾으면
      if (lcVal === 0) callError('type of lcVal: ' + inst);

      // 12자리 operand
      const value = HexToBin16(lcVal.toString(), 3);
      const opCodeBin = bin4fromHex(InstructionTable[inst].hex);
      // 4자리 op_code + 12자리 operand 합치기
      const operand = opCodeBin + ' ' + value;
      lists[LC] = {
        LC,
        instruction: operand,
      };
      LC++;
    }
    // non-MRI
    else if (InstructionTable[inst].kind === 'non-MRI') {
      const operand = InstructionTable[inst].hex;
      lists[LC] = {
        LC,
        instruction: operand,
      };
      LC++;
    } else {
      callError('second Pass - type of inst' + inst);
    }
  });

  return lists;
};

// passOne -> Create for Address-Symbol Table
// input: Asm Source Code
// output: Address-Symbol Table (JSON)
export const firstPass = (string) => {
  let LC = 0;
  const lines = string.split('\n');
  const listing = {};
  let listId = 1;
  let isEnd = false;
  lines.forEach((l) => {
    if (isEnd) return;
    const line = l.toUpperCase();
    const newLine = line.replaceAll(' ', '');
    const commaIndex = newLine.indexOf(',');

    // Label없는 경우
    if (commaIndex === -1) {
      const isORG = newLine.slice(0, 3);
      // ORG인 경우
      if (isORG === 'ORG') {
        const ORG_value = Number(newLine.slice(3));
        if (isNaN(ORG_value)) callError('ORG value Type' + ORG_value);
        // Set Location counter -> continue
        LC = ORG_value;
        return;
      }
      // END인 경우 -> isEnd 설정 -> forEach 루프 탈출
      else if (isORG === 'END') {
        isEnd = true;
        return;
      }
      // 일반 명령어인 경우
      else {
        LC++;
        return;
      }
    }
    // Label인 경우
    else if (commaIndex <= 3) {
      const pseudoIndex = commaIndex + 4;
      // LABEL 있는 경우
      const labelName = newLine.slice(0, commaIndex);
      const pseudoName = newLine.slice(pseudoIndex - 3, pseudoIndex);
      const valueName = newLine.slice(pseudoIndex);
      // 라벨 value -> number타입이 아닌 경우
      if (isNaN(Number(valueName))) {
        callError('Label type');
      }
      if (pseudoName !== 'DEC' && pseudoName !== 'HEX')
        callError('pseudo type');
      const newList = {
        LC,
        label: `${labelName}`,
        pseudo: pseudoName,
        value: valueName,
      };
      listing[listId] = newList;
      newList.id = listId;
      listId++;
      LC++;
    }
  });
  return symbolAddressTable(listing);
};

const symbolAddressTable = (list) => {
  let memoryWord = 1;
  const result = {};
  Object.keys(list).forEach((item) => {
    // label 보정
    const lb = list[item].label + ',';
    // 첫 두글자
    const labelLeft = lb.slice(0, 2);
    const leftCode = convertCharToBin(labelLeft);
    result[memoryWord] = {
      memoryWord,
      symbol: leftCode.symbol,
      hex: leftCode.hex,
      bin: leftCode.bin,
    };
    memoryWord++;
    // 두번 째 글자랑 콤마
    const labelRight = lb.slice(2, 4);
    const rightCode = convertCharToBin(labelRight);
    result[memoryWord] = {
      memoryWord,
      symbol: rightCode.symbol,
      hex: rightCode.hex,
      bin: rightCode.bin,
    };
    memoryWord++;
    // LC
    const { LChex, LCbin } = hexfromLC(list[item].LC);
    result[memoryWord] = {
      memoryWord,
      symbol: '(LC)',
      hex: LChex,
      bin: LCbin,
    };
    memoryWord++;
  });
  return { result, list };
};

const convertCharToBin = (two) => {
  const L = two.slice(0, 1);
  const R = two.slice(1, 2);

  const ascL = L.charCodeAt();
  const hexL = ascL.toString(16).toUpperCase();
  const binL = ascL.toString(2);

  const ascR = R.charCodeAt();
  const hexR = ascR.toString(16).toUpperCase();
  const binR = ascR.toString(2);

  return {
    symbol: interSpace(two),
    hex: `${hexL} ${hexR}`,
    bin: `${splitBinary(binL)} ${splitBinary(binR)}`,
  };
};

function bin4fromHex(hex) {
  let hx = hex.toString(2);
  const len = hx.length;
  for (let i = 0; i < 4 - len; i++) {
    hx = '0' + hx;
  }
  return hx;
}

function hexfromLC(LC) {
  let LC_String = `${LC}`;
  // 4자리수로 맞추기
  const LC_Length = LC_String.length;
  if (LC_Length < 4) {
    for (let i = 0; i < 4 - LC_Length; i++) LC_String = '0' + LC_String;
  }

  const LChex = LC_String.slice(0, 2) + ' ' + LC_String.slice(2, 4);
  const LCbin =
    splitBinary(LC_String.slice(0, 2)) +
    ' ' +
    splitBinary(LC_String.slice(2, 4));
  return { LChex, LCbin };
}

const splitBinary = (bin) => {
  const strLength = bin.length;
  const comLength = 8 - strLength;
  let newStr = '';
  let temStr = bin;
  for (let i = 0; i < comLength; i++) {
    temStr = '0' + temStr;
  }
  newStr = temStr.slice(0, 4) + ' ' + temStr.slice(4);
  return newStr;
};

const interSpace = (str) => {
  const a = str.slice(0, 1);
  const b = str.slice(1, 2);
  return a + ' ' + b;
};

function HexToBin16(st, num) {
  let result = '';
  const hex = `${st}`;
  for (let i = 0; i < num; i++) {
    let a = parseInt(hex.slice(i, i + 1), 16).toString(2);
    const len = a.length;
    for (let j = 0; j < 4 - len; j++) a = '0' + a;
    result += a + ' ';
  }
  return result.slice(0, -1);
}

const callError = (type) => {
  throw new Error(`W T F ${type} Error!!!`);
};
