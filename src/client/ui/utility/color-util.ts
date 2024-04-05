import { PALETTE } from "../constants";

export class ColorUtil {
	public static darken(color: Color3, coefficient: number): Color3 {
		return color.Lerp(PALETTE.black, coefficient);
	}

	public static lighten(color: Color3, coefficient: number): Color3 {
		return color.Lerp(PALETTE.white, coefficient);
	}
}
