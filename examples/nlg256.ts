
import { nlg256, stringToUint8Array} from './dist'

// Helper function to print hash results


function printHash(label: string, input: string | Uint8Array): void {
    const inputData = typeof input === 'string' ? stringToUint8Array(input) : input;
    const hash = nlg256(inputData);
    console.log(`${label}:`);
    console.log(`Input: ${typeof input === 'string' ? input : '<binary data>'}`);
    console.log(`Hash: ${hash}`);
    console.log();
  }
  
  // Test cases
  console.log("NLG256 Hash Function Examples\n");
  
  // 1. Hash a simple string
  printHash("1. Simple string", "NLG");
  
  // 2. Hash an empty string
  printHash("2. Empty string", "");
  
  // 3. Hash a longer text
  printHash("3. Longer text", "The quick brown fox jumps over the lazy dog");
  
  // 4. Demonstrate how a small change affects the hash
  printHash("4. Small change in input", "The quick brown fox jumps over the lazy dog.");
  
  // 5. Hash binary data
  const binaryData = new Uint8Array([0x00, 0xFF, 0xAA, 0x55, 0x12, 0x34, 0x56, 0x78]);
  printHash("5. Binary data", binaryData);
  
  // 6. Hash a very long input
  const longInput = "a".repeat(1000);
  printHash("6. Long input (1000 'a' characters)", longInput);
  
  // 7. Performance test with a very long input
  const veryLongInput = "a".repeat(10000000);  // 1 million 'a' characters
  console.log("7. Performance test (1 million 'a' characters):");
  console.time("Hash time");
  const longHash = nlg256(stringToUint8Array(veryLongInput));
  console.timeEnd("Hash time");
  console.log(`Hash: ${longHash}`);