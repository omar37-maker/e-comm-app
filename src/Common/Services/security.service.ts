import { compare, genSalt, hash } from 'bcrypt';

export default class SecurityService {

  async hash(plainText: string, salt?: number) {
    const generatedSalt = await genSalt(salt);
    return hash(plainText, salt || generatedSalt);
  }

  compare(plainText: string, hash: string) {
    return compare(plainText, hash);
  }
}
