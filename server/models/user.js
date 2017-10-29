import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, unique: true },
    // 昵称
    username: { type: String, unique: true },
    password: { type: String },
    email: {
      type: String,
      lowercase: true,
      unique: true
    },
    avatar: { type: String },
    // 用户是否被删除 0: 正常, 1: 删除
    status: {
      type: Number,
      default: 0
    },
    createTime: {
      type: String,
      default: Date.now
    },
    lastEditTime: {
      type: Date,
      default: Date.now
    }
  },
  { versionKey: false }
);
UserSchema.set("toJSON", { getters: true, virtuals: true });
UserSchema.set("toObject", { getters: true, virtuals: true }); //普通+虚拟

// 虚拟
// UserSchema.virtual('hashedPassword')
//   .set(password => {
//     this._password = password;
//   })
//   .get(() => {
//     return this._password;
//   });

/* UserSchema.virtual('userInfo').get(() => {
	return {
		username: this.username,
		email: this.email,
		avatar: this.avatar
	};
});

// 验证字段
UserSchema.path('username').validate({
	isAsync: true,
	validator(v, cb) {
		const self = this;
		self.constructor.findOne({ username: v }, (err, user) => {
			if (user && self.id !== user.id) {
				cb(false);
			}
			cb(true);
		});
	},
	message: '这个昵称已经被使用!'
});
UserSchema.path('email').validate({
	isAsync: true,
	validator(v, cb) {
		const self = this;
		self.constructor.findOne({ email: v }, (err, user) => {
			if (user && self.id !== user.id) {
				cb(false);
			}
			cb(true);
		});
	},
	message: '这个邮箱已经被使用!'
}); */

const User = mongoose.model("User", UserSchema);
export default User;
