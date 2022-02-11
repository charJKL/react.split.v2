interface ThumbnailNameProps
{
	className?: string;
	name: string;
	searching: string | null;
}

const ThumbnailName = ({className, name, searching}: ThumbnailNameProps) : JSX.Element =>
{
	let input : JSX.Element = <input className={className} type="text" value={name} readOnly />
	
	const wasFound = searching && name.includes(searching);
	if(searching && wasFound)
	{
		const selection = name.replace(searching,`<span>${searching}</span>`);
		input = <div className={className} dangerouslySetInnerHTML={{__html: selection}} />;
	}

	return <div className={className}>{input}</div>;
}

export default ThumbnailName;