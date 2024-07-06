/**
 * Calculates the hash value of a string using the FNV-1a algorithm.
 * 
 * @param value - The string to calculate the hash for.
 * @returns The hash value as a positive integer.
 */
export function hash(value: string): number {
    let hash = 2166136261; // FNV-1a 32-bit offset basis
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24); // hash * FNV_prime
    }
    // Ensure the hash is a positive integer
    return hash >>> 0;
}