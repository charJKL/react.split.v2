import { useEffect, useState } from "react";
import { Position } from "../../../types";

const useCursorPosition = (editor: HTMLElement | null, desktop: HTMLElement | null) : Position | null =>
{
	const [cursor, setCursor] = useState<Position | null>(null);
	
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