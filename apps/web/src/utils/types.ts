import type React from "react";

/** React state setter shorthand */
export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

/** Utility type to describe an update action for a discriminated union reducer */
export type Update<T> = {
	[K in keyof T]: { param: K; value: T[K] };
}[keyof T];
