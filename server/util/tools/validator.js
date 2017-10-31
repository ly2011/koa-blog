/**
 * 数据验证
 */
import validator from 'node-validator';

/**
 * 验证手机号码
 */
export const isMobile = () => {
  const reg = /^(13[0-9]|15[0-9]|18[0-9]|147|145|149|170|171|173|175|176|177|178)d{8}$/;
  return validator.isString({ regex: reg });
};

/**
 * 验证邮箱
 */
export const isEmail = () => {
  const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,4})+$/;
  return validator.isString({ regex: reg });
};
