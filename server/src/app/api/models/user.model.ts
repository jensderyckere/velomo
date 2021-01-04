import { default as mongoose, Schema, Document } from 'mongoose';
import { default as bcrypt } from 'bcrypt';
import { default as validator } from 'validator';

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email:string;
    password: string;
    role: string;
    comparePassword(candidatePass: String, cb: Function): void;
}

const userSchema: Schema = new Schema({
    firstName: {
        type: String,
        required: true,
        unique: false,
    },
    lastName: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'No valid email address provided.'],
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 42,
    },
    role: {
        type: String,
        enum: ['cyclist', 'parent', 'club', 'clubmember', 'admin'],
        default: 'cyclist',
        required: true,
    },
    _createdAt: {
        type: Number,
        required: true,
        default: Date.now(),
    },
    _modifiedAt: {
        type: Number,
        required: false,
        default: null,
    },
    _deletedAt: {
        type: Number,
        required: false,
        default: null,       
    },
});

userSchema.pre('save', function (next) {
    const user: IUser = this as IUser;

    if (!user.isModified('password')) return next();

    try {
        return bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                throw err;
            };

            bcrypt.hash(user.password, salt, (errHash, hash) => {
                if (errHash) {
                    throw errHash;
                };

                user.password = hash;
                return next();
            });
        });
    } catch (e) {
        return next(e);
    };
});

userSchema.methods.comparePassword = function(candidatePass: String, cb: Function) {
    const user = this;
    bcrypt.compare(candidatePass, user.password, (err, match) => {
        if (err) {
            return cb(err, null);
        };

        return cb(null, match);
    });
};

const User = mongoose.model<IUser>('User', userSchema);

export {
    IUser,
    userSchema,
    User,
};