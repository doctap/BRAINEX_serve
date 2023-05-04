import fs from 'fs';

export const convertBase64 = (path: string) => {
	const bitmap = fs.readFileSync(path);
	return bitmap.toString('base64');
}