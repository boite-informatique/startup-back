import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class HashingService {
    async generate(plaintext: string): Promise<string> {
        return await hash(plaintext, SALT_ROUNDS);
    }

    async verify(plaintext: string, hash: string): Promise<boolean> {
        return await compare(plaintext, hash);
    }
}
