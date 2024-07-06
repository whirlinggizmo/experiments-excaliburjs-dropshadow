// Note: Wrapping Excalubur's Random so we don't have to include additional packages
// Prevously used:
// import random from 'random';
// import seedrandom from 'seedrandom';
// Some of these methods (like the d2, d4, d6, etc) could have called the Excalibur equivalent methods.
// This will allow us to port back to random/seedrandom and keep the same API.
// Additionally, it allows reseeding with a string, instead of only a number.

import { Random as ExRandom } from 'excalibur';


import { hash } from './math';

/**
 * Represents a random number generator.
 * @remarks
 * This class wraps Excalibur's Random class to provide additional functionality.
 * It would have been nice to extend Excalibur's Random class, but it doesn't have a way to reseed without creating a new instance.
 * @see {@link https://excaliburjs.com/docs/random}
 */
export class Random {

    protected random: ExRandom;

    /**
     * Creates a new instance of the `Random` class.
     * @param seed - The seed value for the random number generator. If a string is provided, it will be hashed to generate the seed.
     */
    constructor(seed?: number | string) {
        if (typeof seed === 'string') {
            seed = hash(seed);
        }
        this.random = new ExRandom(seed || Date.now());
    }

    /**
     * Reseeds the random number generator with a new seed.
     * @param seed - The new seed value for the random number generator. If a string is provided, it will be hashed to generate the seed.
     * @returns The current instance of the `Random` class.
     */
    public reseed(seed?: number | string) {
        if (typeof seed === 'string') {
            seed = hash(seed);
        }
        this.random = new ExRandom(seed || Date.now());

        return this;
    }

    /**
     * Generates a random floating-point number between the specified minimum and maximum values.
     * @param min - The minimum value (inclusive).
     * @param max - The maximum value (exclusive).
     * @returns A random floating-point number between the minimum and maximum values.
     */
    randomNumber(min = 1, max?: number) {
        // includes min, excludes max
        if (max !== undefined) {
            //return Math.random() * (max - min) + min;
            return this.random.floating(min, max);
        } else {
            // asking for a number between 0 and max (provided in the min argument)
            //return Math.random() * (min);
            return this.random.floating(0, min);
        }
    }

    /**
     * Generates a random integer between the specified minimum and maximum values.
     * @param min - The minimum value (inclusive).
     * @param max - The maximum value (exclusive).
     * @returns A random integer between the minimum and maximum values.
     */
    randomInteger(min: number, max?: number) {
        // includes min, excludes max
        if (max !== undefined) {
            //return Math.floor(min + Math.random() * (max - min));
            return Math.floor(min + this.random.next() * (max - min));
        } else {
            // asking for a number between 0 and max (provided in the min argument)
            //return Math.floor(Math.random() * (min));
            return Math.floor(this.random.next() * min);
        }
    }

    /**
     * Generates an array of random points within the specified width and height.
     * @param width - The width of the area.
     * @param height - The height of the area.
     * @param nPoints - The number of random points to generate.
     * @param margin - The margin around the area to exclude from generating points (optional, default is 0).
     * @returns An array of random points within the specified width and height.
     */
    randomPoints(width: number, height: number, nPoints: number, margin: number = 0): { x: number, y: number }[] {
        const points = [];
        for (let i = 0; i < nPoints; i++) {
            points.push({
                x: this.randomNumber(margin, width - margin),
                y: this.randomNumber(margin, height - margin)
            });
        }
        return points;
    }

    /**
     * Generates a random point within the specified radius from the center point.
     * @param centerX - The x-coordinate of the center point.
     * @param centerY - The y-coordinate of the center point.
     * @param outerRadius - The outer radius of the area.
     * @param innerRadius - The inner radius of the area (optional, default is 0).
     * @returns A random point within the specified radius from the center point.
     * @throws An error if the inner or outer radius values are invalid.
     */
    randomPointInRadius(centerX: number, centerY: number, outerRadius: number, innerRadius = 0): { x: number, y: number } {
        if (innerRadius < 0 || outerRadius < innerRadius) throw new Error('Invalid radius values.');

        const angle = this.randomNumber() * 2 * Math.PI; // Random angle in [0, 2π]
        const radius = Math.sqrt(this.randomNumber() * (outerRadius ** 2 - innerRadius ** 2) + innerRadius ** 2); // Random radius in [innerRadius, outerRadius]

        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    }

    /**
     * Generates a random point within the specified bounding box.
     * @param x - The x-coordinate of the top-left corner of the bounding box.
     * @param y - The y-coordinate of the top-left corner of the bounding box.
     * @param width - The width of the bounding box.
     * @param height - The height of the bounding box.
     * @returns A random point within the specified bounding box.
     */
    randomPointInBox(x: number, y: number, width: number, height: number): { x: number, y: number } {
        return {
            x: this.randomNumber(x, x + width),
            y: this.randomNumber(y, y + height)
        };
    }

    /**
     * Generates a random boolean value.
     * @returns A random boolean value.
     */
    randomBoolean() {
        return this.random.next() < 0.5;
    }

    /**
     * Generates a random element from the specified array.
     * @param array - The array of elements to choose from.
     * @returns A random element from the specified array.
     */
    randomElement<T>(array: T[]): T {
        return array[this.randomInteger(0, array.length)];
    }

    /**
     * Shuffles the elements of the specified array.
     * @param array - The array of elements to shuffle.
     * @returns The shuffled array.
     */
    shuffle<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = this.randomInteger(0, i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Generates a random color.
     * @returns A random color as a RGBA value (0-1).
     * @param randomAlpha - Whether to generate a random alpha value (optional, default is false).
     */
    randomColorFloat(randomAlpha?: boolean): { r: number, g: number, b: number, a: number } {
        return {
            r: this.randomNumber(),
            g: this.randomNumber(),
            b: this.randomNumber(),
            a: randomAlpha ? this.randomNumber() : 1
        };
    }

    /**
     * Generates a random color.
     * @returns A random color as a RGBA value (0-255).
     * @param randomAlpha - Whether to generate a random alpha value (optional, default is false).
     */
    randomColorByte(randomAlpha?: boolean): { r: number, g: number, b: number, a: number } {
        return {
            r: Math.floor(this.randomNumber() * 256),
            g: Math.floor(this.randomNumber() * 256),
            b: Math.floor(this.randomNumber() * 256),
            a: randomAlpha ? Math.floor(this.randomNumber() * 256) : 255
        };
    }

    /**
     * Generates a random color.
     * @returns A random color as a hex value.
     * @param randomAlpha - Whether to generate a random alpha value (optional, default is false).
     */
    randomColorHex(randomAlpha?: boolean): string {
        const color = this.randomColorByte(randomAlpha);
        return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}${color.a.toString(16).padStart(2, '0')}`;
    }

    /**
     * Generates a random string of the specified length.
     * @param length - The length of the random string.
     * @returns A random string of the specified length.
     */
    randomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(this.randomInteger(0, characters.length));
        }
        return result;
    }

    /**
     * Generates a random coin flip
     */
    flip() {
        return this.randomBoolean() ? 'heads' : 'tails';
    }

    /**
     * Generates a random die roll for a d2 (coin flip)
     */
    d2(): number {
        return this.randomInteger(1, 3);
    }

    /**
     * Generates a random die roll for a d4
     */
    d4(): number {
        return this.randomInteger(1, 5);
    }

    /**
     * Generates a random die roll for a d6
     */
    d6(): number {
        return this.randomInteger(1, 7);
    }

    /**
     * Generates a random die roll for a d8
     */
    d8(): number {
        return this.randomInteger(1, 9);
    }

    /**
     * Generates a random die roll for a d10
     */
    d10(): number {
        return this.randomInteger(1, 11);
    }

    /**
     * Generates a random die roll for a d12
     */
    d12(): number {
        return this.randomInteger(1, 13);
    }

    /**
     * Generates a random die roll for a d20
     */
    d20(): number {
        return this.randomInteger(1, 21);
    }

    /**
     * Generates a random die roll for a d100
     */
    d100(): number {
        return this.randomInteger(1, 101);
    }
}

// Export a singleton instance of the Random class
export const random = new Random(1234);