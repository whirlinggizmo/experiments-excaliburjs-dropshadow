
export function toHexColor(r: number, g: number, b: number): string {
    // generate a hex string from RGB values
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}