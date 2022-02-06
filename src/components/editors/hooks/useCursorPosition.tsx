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
			const editorPosition = editor.getBoundingClientRect();
			const desktopPosition = desktop.getBoundingClientRect();
			const left = e.clientX - desktopPosition.left - editorPosition.left;
			const top = e.clientY - desktopPosition.top - editorPosition.top;
			setCursor({left, top});
		}
		
		desktop.addEventListener('mousemove', mouseMove);
		return () => {
			desktop.removeEventListener('mousemove', mouseMove);
		}
	}, [editor, desktop])
	
	return cursor;
}

export default useCursorPosition;