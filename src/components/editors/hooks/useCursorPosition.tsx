import { useEffect, useState } from "react";
import type {Position} from "../types/Position";

const useCursorPosition = (editor: HTMLElement | null, desktop: HTMLElement | null) =>
{
	const [cursor, setCursor] = useState<Position>({left:0, top: 0});
	
	useEffect(() =>{
		if(editor === null) return;
		if(desktop === null) return;
		
		const mouseMove = (e: MouseEvent) =>
		{
			const desktopPosition = desktop.getBoundingClientRect();
			const left = e.clientX - desktopPosition.left;
			const top = e.clientY - desktopPosition.top;
			setCursor({left, top});
		}
		
		editor.addEventListener('mousemove', mouseMove);
		return () => {
			editor.removeEventListener('mousemove', mouseMove);
		}
	}, [editor, desktop])
	
	return cursor;
}

export default useCursorPosition;