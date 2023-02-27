import * as mongoose from 'mongoose';
// import validator from 'validator';
import isEmail from 'validator/lib/isEmail';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please, provide name'],
    minlength: 6,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, 'Please, provide email'],
    // we could use regEx + match property but i used validator library
    validate: {
      validator: isEmail,
      message: 'Please, provide valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please, provide password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

export default mongoose.model('User', UserSchema);
