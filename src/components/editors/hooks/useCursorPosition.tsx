import { useState } from "react";
import type {Position} from "../types/Position";

const useCursorPosition = (editorPosition: Position, desktopPosition: Position) =>
{
	const [cursor, setCursor] = useState<Position>({left: 0, top: 0});
	
	const mouseMove = (e: MouseEvent) =>
	{
		const left = e.clientX - desktopPosition.left - editorPosition.left;
		const top = e.clientY - desktopPosition.top - editorPosition.top;
		setCursor({left, top});
	}
	
	return {cursor, mouseMove};
}

export default useCursorPosition;