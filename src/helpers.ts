// Helper function to convert string to Uint8Array
export function stringToUint8Array(str: string): Uint8Array {
    return new TextEncoder().encode(str);
  }