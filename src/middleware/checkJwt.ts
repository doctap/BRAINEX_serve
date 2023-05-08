import crypto from 'crypto';

const set = new Set();

export const getToken = (): string => {
	const uuid = crypto.randomUUID();

	if (set.has(uuid))
		return getToken();

	set.add(uuid);

	return uuid;
}

export const checkToken = (token: string) => {
	return set.has(token);
};

export const removeToken = (token: string) => set.delete(token);