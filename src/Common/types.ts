import { HydratedDocument } from 'mongoose';
import { User } from '../DB/Schemas/user.schema';

export type UserDocument = HydratedDocument<User>;
