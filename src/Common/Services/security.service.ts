import { compare, genSalt, hash } from 'bcrypt';

export default class SecurityService {

  async hash(plainText: string, salt?: number) {
    const generatedSalt = await genSalt()
    return hash (plainText, salt || generatedSalt);
  }

  compare(plainText: string, hash: string) {
    return compare(plainText, hash);
  }
}
