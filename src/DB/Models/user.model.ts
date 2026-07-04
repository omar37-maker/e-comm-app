import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../Schemas';
import SecurityService from './../../Common/Services/security.service';

const securityService = new SecurityService();

export const userModel = MongooseModule.forFeatureAsync([
  {
    name: User.name,
    useFactory: () => {
      const schema = UserSchema;

      schema.pre('save', async function() { 
        if (this.isModified('password')) { 
          this.password = await securityService.hash(this.password);
        }
      })
      return schema;
    },
  },
]);
