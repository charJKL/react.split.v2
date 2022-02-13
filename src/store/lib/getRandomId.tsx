const getRandomId = (length: number) =>
{
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let hash = '';
	for(var i = 0; i < length ; i++) hash += characters.charAt(Math.floor(Math.random() * characters.length));
	return hash;
}

export default getRandomId;