import random from 'random';
import seedrandom from 'seedrandom';

export function setRandomSeed(seed = '1234') {
    random.use(seedrandom(seed) as any); // use seedrandom as the underlying PRNG.
}
setRandomSeed();

export function randomNumber(min = 1, max?: number) {
    // includes min, excludes max
    if (max !== undefined) {
        //return Math.random() * (max - min) + min;
        return random.float(min, max);
    } else {
        // asking for a number between 0 and max (provided in the min argument)
        //return Math.random() * (min);
        return random.float(0, min);
    }
}
export function randomInteger(min: number, max?: number) {
    // includes min, excludes max
    if (max !== undefined) {
        //return Math.floor(min + Math.random() * (max - min));
        return Math.floor(min + random.float() * (max - min));
    } else {
        // asking for a number between 0 and max (provided in the min argument)
        //return Math.floor(Math.random() * (min));
        return Math.floor(random.float() * min);
    }
}

export function randomPoints([width, height]: [number, number], nPoints: number, margin: number = 0): { x: number, y: number }[] {
    const points = [];
    for (let i = 0; i < nPoints; i++) {
        points.push({
            x: randomNumber(margin, width - margin),
            y: randomNumber(margin, height - margin)
        });
    }
    return points;
}

export function randomPointInRadius2D(center: { x: number, y: number }, outerRadius: number, innerRadius = 0): { x: number, y: number } {
    if (innerRadius < 0 || outerRadius < innerRadius) throw new Error('Invalid radius values.');

    const angle = randomNumber() * 2 * Math.PI; // Random angle in [0, 2π]
    const radius = Math.sqrt(randomNumber() * (outerRadius ** 2 - innerRadius ** 2) + innerRadius ** 2); // Random radius in [innerRadius, outerRadius]

    return {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle)
    };
}
