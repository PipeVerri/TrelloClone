// utils/gradient.ts
type Mode = "analogous" | "split" | "triadic";
type Temperament = "vibrant" | "soft";

interface GradientOptions {
	seed?: string | number; // make it deterministic
	mode?: Mode; // color harmony
	temperament?: Temperament; // saturation/lightness profile
	angle?: number; // 0..360; if omitted it's random
	threeStops?: boolean; // add a mid stop for depth (default true)
}

type Range = [number, number];
interface Ranges {
	s1: Range;
	s2: Range;
	sm: Range;
	l1: Range;
	l2: Range;
	lm: Range;
}

export function generateGradient(opts: GradientOptions = {}): string {
	const { seed, mode, temperament = "vibrant", angle, threeStops = true } = opts;

	// --- RNG (deterministic if seed provided) ---
	const rand = (() => {
		const cyrb53 = (str: string, seed = 0) => {
			let h1 = 0xdeadbeef ^ seed,
				h2 = 0x41c6ce57 ^ seed;
			for (let i = 0; i < str.length; i++) {
				const ch = str.charCodeAt(i);
				h1 = Math.imul(h1 ^ ch, 2654435761);
				h2 = Math.imul(h2 ^ ch, 1597334677);
			}
			h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
			h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
			return (4294967296 * (2097151 & h2) + (h1 >>> 0)) >>> 0;
		};
		const mulberry32 = (a: number) => () => {
			// biome-ignore lint/suspicious/noAssignInExpressions: Doesn't have to be clean code
			let t = (a += 0x6d2b79f5);
			t = Math.imul(t ^ (t >>> 15), t | 1);
			t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};

		if (typeof seed === "string") return mulberry32(cyrb53(seed));
		if (typeof seed === "number") return mulberry32(seed >>> 0);
		return Math.random; // non-deterministic
	})();

	// --- Choose harmony mode (weighted toward smoother looks) ---
	const pickMode = (): Mode => {
		if (mode) return mode;
		const r = rand();
		if (r < 0.6) return "analogous";
		if (r < 0.85) return "split";
		return "triadic";
	};

	const m = pickMode();
	const base = Math.floor(rand() * 360);

	// --- Hue helpers ---
	const wrap = (h: number) => ((h % 360) + 360) % 360;
	const jitter = (n: number, j: number) => n + (rand() * 2 - 1) * j;

	// --- Build hues based on harmony ---
	let h1 = base;
	let h2 = base;
	let hm = base;

	if (m === "analogous") {
		const delta = 22 + rand() * 16; // 22°–38°
		const sign = rand() < 0.5 ? -1 : 1;
		h2 = wrap(base + sign * delta);
		hm = wrap(base + sign * (delta / 2)); // midpoint hue
	} else if (m === "split") {
		const delta = 150 + rand() * 30; // 150°–180°
		h2 = wrap(base + delta);
		hm = wrap(base + (delta > 180 ? delta - 30 : delta - 30)); // slight inward tilt
	} else {
		// triadic
		h2 = wrap(base + 120 + (rand() * 14 - 7)); // 113°–127°
		hm = wrap(base - 120 + (rand() * 14 - 7)); // 233°–247°
	}

	// --- Temperament: saturation/lightness ranges tuned for "pretty" ---
	const ranges: Ranges =
		temperament === "vibrant"
			? { s1: [72, 86], s2: [70, 84], sm: [60, 74], l1: [50, 58], l2: [52, 60], lm: [64, 72] }
			: {
					s1: [56, 68],
					s2: [54, 66],
					sm: [42, 56],
					l1: [60, 68],
					l2: [62, 70],
					lm: [74, 82],
				};

	const pick = ([a, b]: [number, number]) => a + rand() * (b - a);

	const s1 = Math.round(pick(ranges.s1));
	const s2 = Math.round(pick(ranges.s2));
	const sm = Math.round(pick(ranges.sm));
	const l1 = Math.round(pick(ranges.l1));
	const l2 = Math.round(pick(ranges.l2));
	const lm = Math.round(pick(ranges.lm));

	// Gentle micro-variation so repeated seeds look alive across modes
	h1 = wrap(jitter(h1, 2));
	h2 = wrap(jitter(h2, 2));
	hm = wrap(jitter(hm, 1.5));

	const ang = angle ?? Math.floor(rand() * 360);

	const stopA = `hsl(${h1} ${s1}% ${l1}%)`;
	const stopB = `hsl(${hm} ${sm}% ${lm}%)`;
	const stopC = `hsl(${h2} ${s2}% ${l2}%)`;

	// 3-stop gradients add depth and reduce muddy blends
	return threeStops ? `linear-gradient(${ang}deg, ${stopA}, ${stopB}, ${stopC})` : `linear-gradient(${ang}deg, ${stopA}, ${stopC})`;
}
