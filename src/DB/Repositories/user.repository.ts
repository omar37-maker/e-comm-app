import { InjectModel } from '@nestjs/mongoose';
import { User } from '../Schemas';
import BaseRepository from './base.repository';
import { UserDocument } from '../../Common';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
class UserRepository extends BaseRepository<UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }
}

export default UserRepository;
