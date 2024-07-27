// src/neccak256.ts
// license: MIT
// This script implements a NLG-256 hashing algorithm using the custom NLGdecimal number system.

import { decimalToNlgmal, nlgmalToDecimal } from './nmal';

// SHA-3 (Keccak-256) rotation offsets
const RHO_OFFSETS = [
    0, 1, 62, 28, 27, 36, 44, 6, 55, 20, 3, 10, 43, 25, 39, 41, 45, 15, 21, 8, 18, 2, 61, 56, 14
];

// SHA-3 (Keccak-256) round constants
const THETA_CONSTANTS = [
    0x0000000000000001, 0x0000000000008082, 0x800000000000808A, 0x8000000080008000,
    0x000000000000808B, 0x0000000080000001, 0x8000000080008081, 0x8000000000008009,
    0x000000000000008A, 0x0000000000000088, 0x0000000080008009, 0x000000008000000A,
    0x000000008000808B, 0x800000000000008B, 0x8000000000008089, 0x8000000000008003,
    0x8000000000008002, 0x8000000000000080, 0x000000000000800A, 0x800000008000000A,
    0x8000000080008081, 0x8000000000008080, 0x0000000080000001, 0x8000000080008008
];

// Convert SHA-3 (Keccak-256) constants to NLGdecimal number system
const RHO_OFFSETS_NLG = RHO_OFFSETS;
const THETA_NLG = THETA_CONSTANTS.map(k => decimalToNlgmal(k));
const PI_NLG = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]; // Linear Pi permutation values

function rotr(n: number, x: number, bits: number = 64): number {
    return ((x >> n) | (x << (bits - n))) & ((1 << bits) - 1);
}

function readUInt64LE(buffer: Uint8Array, offset: number): number {
    let value = 0n;
    for (let i = 0; i < 8; i++) {
        value |= BigInt(buffer[offset + i]) << (BigInt(i) * 8n);
    }
    return Number(value);
}

function writeUInt64LE(buffer: Uint8Array, offset: number, value: number): void {
    const bigValue = BigInt(value);
    for (let i = 0; i < 8; i++) {
        buffer[offset + i] = Number((bigValue >> (BigInt(i) * 8n)) & 0xFFn);
    }
}

function neccakF(state: number[]): void {
    for (let roundIdx = 0; roundIdx < 24; roundIdx++) {
        // Theta step
        const C = Array(5).fill(0);
        const D = Array(5).fill(0);

        for (let x = 0; x < 5; x++) {
            C[x] = state[x] ^ state[x + 5] ^ state[x + 10] ^ state[x + 15] ^ state[x + 20];
        }

        for (let x = 0; x < 5; x++) {
            D[x] = C[(x - 1 + 5) % 5] ^ rotr(1, C[(x + 1) % 5], 64);
        }

        for (let x = 0; x < 25; x++) {
            state[x] ^= D[x % 5];
        }

        // Rho and Pi steps
        const B = Array(25).fill(0);
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                const rhoOffset = RHO_OFFSETS_NLG[(x + 3 * y) % 24];
                B[((PI_NLG[x] * 5) + y) % 25] = rotr(rhoOffset, state[x * 5 + y]);
            }
        }

        // Chi step
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                state[x * 5 + y] = B[x * 5 + y] ^ ((~B[(x + 1) % 5 * 5 + y]) & B[(x + 2) % 5 * 5 + y]);
            }
        }

        // Iota step
        state[0] ^= nlgmalToDecimal(THETA_NLG[roundIdx]);
    }
}

export function neccak256(data: Uint8Array): string {
    // Initialize state
    const state = Array(25).fill(0);
    const length = data.length * 8;

    // Padding
    const paddedData = new Uint8Array(data.length + 200);
    paddedData.set(data);
    paddedData[data.length] = 0x01;
    let padLength = paddedData.length;
    while (padLength % 200 !== 192) {
        paddedData[padLength++] = 0x00;
    }
    writeUInt64LE(paddedData, padLength, length);

    // Absorb phase
    for (let i = 0; i < paddedData.length; i += 200) {
        const block = paddedData.slice(i, i + 200);
        for (let j = 0; j < 25; j++) {
            state[j] ^= readUInt64LE(block, j * 8);
        }
        neccakF(state);
    }

    // Squeeze phase
    const output = new Uint8Array(64);
    let outIdx = 0;
    for (let i = 0; i < 2; i++) { // Two 64-byte blocks for Neccak-256
        for (let j = 0; j < 25; j++) {
            writeUInt64LE(output, outIdx, state[j]);
            outIdx += 8;
        }
        neccakF(state);
    }

    // Return first 256 bits as NLGdecimal
    return state.slice(0, 4).map(x => decimalToNlgmal(x)).join('');
}
