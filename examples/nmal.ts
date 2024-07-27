// examples/example.ts

import {
    decimalToNlgmal,
    nlgmalToDecimal,
    bytesToNlgdecimal,
    nlgdecimalToBytes,
    NLGmalBase,
    NLGmalChars
  } from 'nmal';  // Adjust this import path as needed
  
  console.log("NLGmal Base:", NLGmalBase);
  console.log("NLGmal Characters:", NLGmalChars);
  
  // Example 1: Convert decimal to NLGmal
  const decimal1 = 10000;
  const nlgmal1 = decimalToNlgmal(decimal1);
  console.log(`\nDecimal ${decimal1} in NLGmal:`, nlgmal1);
  
  // Example 2: Convert NLGmal to decimal
  const nlgmal2 = 't8s';
  const decimal2 = nlgmalToDecimal(nlgmal2);
  console.log(`NLGmal '${nlgmal2}' in decimal:`, decimal2);
  
  // Example 3: Convert bytes to NLGmal
  const bytes1 = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in ASCII
  const nlgmal3 = bytesToNlgdecimal(bytes1);
  console.log("\nBytes [72, 101, 108, 108, 111] in NLGmal:", nlgmal3);
  
  // Example 4: Convert NLGmal to bytes
  const nlgmal4 = 'noup';
  const bytes2 = nlgdecimalToBytes(nlgmal4);
  console.log(`NLGmal '${nlgmal4}' as bytes:`, bytes2);
  
  // Example 5: Roundtrip conversion (decimal -> NLGmal -> decimal)
  const originalDecimal = 12345;
  const roundtripNlgmal = decimalToNlgmal(originalDecimal);
  const roundtripDecimal = nlgmalToDecimal(roundtripNlgmal);
  console.log("\nRoundtrip conversion:");
  console.log(`Original decimal: ${originalDecimal}`);
  console.log(`As NLGmal: ${roundtripNlgmal}`);
  console.log(`Back to decimal: ${roundtripDecimal}`);
  
  // Example 6: Handling uppercase input
  const uppercaseNlgmal = 'MM';
  console.log("\nHandling uppercase input:");
  const decimalFromUppercase = nlgmalToDecimal(uppercaseNlgmal);
  console.log(`NLGmal '${uppercaseNlgmal}' in decimal:`, decimalFromUppercase);