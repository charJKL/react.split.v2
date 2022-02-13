
const trimFileExtension = (filename: string) =>
{
	return filename.substring(0, filename.lastIndexOf('.'));
}

export default trimFileExtension;