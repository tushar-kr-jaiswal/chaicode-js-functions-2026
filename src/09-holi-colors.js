/**
 * 🎨 Holi Color Mixer - Pure Functions
 *
 * Holi ka festival hai! Rang mix karne hain. Lekin PURE FUNCTIONS use
 * karne hain — matlab:
 *   1. Input ko KABHI modify mat karo (no mutation)
 *   2. Same input pe HAMESHA same output aaye
 *   3. Koi side effects nahi (no console.log, no external state changes)
 *
 * Har color object: { name: string, r: number, g: number, b: number }
 *   where r, g, b are 0-255 (RGB values)
 *
 * Functions:
 *
 *   1. mixColors(color1, color2)
 *      - Mix two colors by averaging their RGB values
 *      - New name: `${color1.name}-${color2.name}`
 *      - Round RGB values to integers
 *      - MUST NOT modify color1 or color2
 *      - Agar either color null/invalid, return null
 *
 *   2. adjustBrightness(color, factor)
 *      - Multiply each RGB by factor, clamp to 0-255 range
 *      - Round to integers using Math.round
 *      - Name stays same
 *      - MUST NOT modify original color
 *      - Agar color null or factor not number, return null
 *
 *   3. addToPalette(palette, color)
 *      - Return NEW array with color added at end
 *      - MUST NOT modify original palette array
 *      - Agar palette not array, return [color]
 *      - Agar color null/invalid, return copy of palette
 *
 *   4. removeFromPalette(palette, colorName)
 *      - Return NEW array without the color with that name
 *      - MUST NOT modify original palette
 *      - Agar palette not array, return []
 *
 *   5. mergePalettes(palette1, palette2)
 *      - Merge two palettes into NEW array
 *      - No duplicate names (keep first occurrence)
 *      - MUST NOT modify either original palette
 *      - Agar either not array, treat as empty array
 *
 * Hint: Use spread operator [...arr], Object spread {...obj} to create
 *   copies. NEVER use push, splice, or direct property assignment on inputs.
 *
 * @example
 *   const red = { name: "red", r: 255, g: 0, b: 0 };
 *   const blue = { name: "blue", r: 0, g: 0, b: 255 };
 *   mixColors(red, blue)
 *   // => { name: "red-blue", r: 128, g: 0, b: 128 }
 *   // red and blue objects are UNCHANGED
 */
export function mixColors(color1, color2) {
    if (typeof color1 !== "object" || Array.isArray(color1) || color1 === null) return null;
    if (typeof color2 !== "object" || Array.isArray(color2) || color2 === null) return null;

    const mixedColor = {};
    mixedColor.name = `${color1.name}-${color2.name}`;
    mixedColor.r = Math.round((color1.r + color2.r) / 2);
    mixedColor.g = Math.round((color1.g + color2.g) / 2);
    mixedColor.b = Math.round((color1.b + color2.b) / 2);

    return mixedColor;
}

export function adjustBrightness(color, factor) {
    if (typeof color !== "object" || Array.isArray(color) || color === null) return null;
    if (typeof factor !== "number" || !Number.isFinite(factor) || factor < 0) return null;

    const multipliedColor = {};

    multipliedColor.name = color.name;
    multipliedColor.r = Math.round(color.r * factor) > 255 ? 255 : Math.round(color.r * factor);
    multipliedColor.g = Math.round(color.g * factor) > 255 ? 255 : Math.round(color.g * factor);
    multipliedColor.b = Math.round(color.b * factor) > 255 ? 255 : Math.round(color.b * factor);

    return multipliedColor;
}

export function addToPalette(palette, color) {
    if (!Array.isArray(palette)) return [color];

    const replicaArr = structuredClone(palette);
    if (Array.isArray(color) || typeof color !== "object" || color === null) return replicaArr;

    replicaArr.push(color);
    return replicaArr;
}

export function removeFromPalette(palette, colorName) {
    if (!Array.isArray(palette)) return [];

    let replicaArr = structuredClone(palette);
    if (typeof colorName !== "string" || colorName.trim() === "") return replicaArr;

    const result = replicaArr.find((obj) => obj.name === colorName);
    if (!result) return replicaArr;

    replicaArr = replicaArr.filter((obj) => obj.name !== colorName);

    return replicaArr;
}

export function mergePalettes(palette1, palette2) {
    const firstPalette =
        !Array.isArray(palette1) || palette1.length === 0 ? [] : structuredClone(palette1);
    const secondPalette =
        !Array.isArray(palette2) || palette2.length === 0 ? [] : structuredClone(palette2);

    if (firstPalette.length === 0 && secondPalette.length === 0) return [];

    let mergedArr = structuredClone(firstPalette);

    secondPalette.forEach((obj) => {
        const result = mergedArr.some((color) => color.name === obj.name);
        if (!result) mergedArr.push(obj);
    });

    return mergedArr;
}
