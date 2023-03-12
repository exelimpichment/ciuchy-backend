import * as mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt';

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

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // ^ this refers to Schema
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

// UserSchema.methods.comparePassword = function (candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };

export default mongoose.model('User', UserSchema);
