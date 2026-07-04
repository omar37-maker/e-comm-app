import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { UserRole, Gender } from '../../Common';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class User {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minLength: [3, 'First name must be at least 3 characters long'],
    maxLength: [50, 'First name must be at most 50 characters long'],
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minLength: [3, 'First name must be at least 3 characters long'],
    maxLength: [50, 'First name must be at most 50 characters long'],
  })
  lastName: string;

  @Virtual({
    get: function (this: User) {
      return `${this.firstName} ${this.lastName}`;
    },
  })
  Fullname: string;
  @Prop({
    type: String,
    required: true,
    index: { name: 'idx_email_unique', unique: true },
  })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: String, enum: Gender })
  gender: Gender;

  @Prop({
    type: String,
    required: true,
    index: { name: 'idx_phoneNumber_unique', unique: true },
  })
  phoneNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
