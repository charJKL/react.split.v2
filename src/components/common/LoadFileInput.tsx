import React, { useRef } from "react";

type LoadFileInputProps = 
{
	children: React.ReactNode;
	onFiles?: (files: Array<File>) => void;
}

const LoadFileInput = ({children, onFiles}: LoadFileInputProps) : JSX.Element =>
{
	var reference = useRef<HTMLInputElement>(null);

	const onChangeHandler = (e: React.ChangeEvent) => {
		if(onFiles && reference.current)
		{
			const files = reference.current.files ?? [];
			onFiles(Array.from(files));
			
		}
	}
	
	return (
		<>
			<input type="file" accept="image/*" multiple ref={reference} onChange={onChangeHandler} />
		</>
	)
}

export default LoadFileInput;

/*
			<button class="load-files" @click="this.$refs.loadImagesFiles.click()">Load files</button>
	<input class="file-list" type="text" :value="getList" @click="this.$refs.loadImagesFiles.click()" readonly />
	<input class="input-hide" ref="loadImagesFiles" @change="onLoadImagesFiles" type="file" accept="image/*" multiple />
		
	*/	