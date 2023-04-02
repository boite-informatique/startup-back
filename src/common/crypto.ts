import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 10;

export const generateHash = async (plaintext: string): Promise<string> => {
    return await hash(plaintext, SALT_ROUNDS);
};

export const verifyHash = async (
    plaintext: string,
    hash: string,
): Promise<boolean> => {
    return await compare(plaintext, hash);
};
