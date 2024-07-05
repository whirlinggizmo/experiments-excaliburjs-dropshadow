
export function stringToHash(str: string): number {
    let hash = 2166136261; // FNV-1a 32-bit offset basis
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24); // hash * FNV_prime
    }
    // Ensure the hash is a positive integer
    return hash >>> 0;
}