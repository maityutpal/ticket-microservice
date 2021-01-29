import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scriptAsync = promisify(scrypt);

export class Password {
  static async tohash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scriptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }
  static async compare(storedpassword: string, suppliedpassword: string) {
    const [hashedPassword, salt] = storedpassword.split('.');
    const buf = (await scriptAsync(suppliedpassword, salt, 64)) as Buffer;
    return buf.toString('hex') === hashedPassword;
  }
}
