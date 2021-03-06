import { ONE3, sub3 } from "@thi.ng/vectors";
import { ColorOp } from "./api";
import { clamp } from "./clamp";

/**
 * Inverts the RGB channels of an RGBA color.
 *
 * @param out
 * @param src
 */
export const invertRGB: ColorOp = (out, src) => (
    (out = clamp(out || src, src)), sub3(out, ONE3, out)
);

/**
 * Inverts the lowest 24 bits of an ARGB int.
 *
 * @param src
 */
export const invertInt = (src: number) => src ^ 0xffffff;
