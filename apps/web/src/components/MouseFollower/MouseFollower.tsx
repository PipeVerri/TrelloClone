import type React from "react";
import { useEffect, useState } from "react";

interface Props {
	children: React.ReactNode;
	onRelease: () => void;
	offset: { x: number; y: number };
}

/**
 * A utility component that renders its children following the mouse cursor while dragging.
 * @param children - The visual element to follow the cursor
 * @param onRelease - Callback executed once the mouse is released
 */
export default function MouseFollower({ children, onRelease, offset }: Props) {
	const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	useEffect(() => {
		const updatePosition = (e: MouseEvent) => {
			setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
		};

		// Add listeners after mount so they don't run before the component exists
		window.addEventListener("mousemove", updatePosition);
		window.addEventListener("mouseup", onRelease);

		return () => {
			// Cleanup to avoid leaks and stray handlers after unmount
			window.removeEventListener("mousemove", updatePosition);
			window.removeEventListener("mouseup", onRelease);
		};
	}, [onRelease, offset]);

	// pointerEvents none so CardContainers still receive hover while the ghost floats above
	return (
		<div
			style={{
				position: "absolute",
				left: position.x,
				top: position.y,
				pointerEvents: "none",
			}}
		>
			{children}
		</div>
	);
}
