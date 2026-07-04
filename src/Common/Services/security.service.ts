import { compare, hash } from 'bcrypt';

export default class SecurityService {

  async hash(plainText: string, salt?: number) {
    // const generatedSalt = await genSalt(salt);
    console.log({ mm: process.env.SALT_ROUNDS });
    
    const defaultSalt = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;
    return hash(plainText, salt || defaultSalt);
  }

  compare(plainText: string, hash: string) {
    return compare(plainText, hash);
  }
}
