import REGEX from 'constants/RegEx';

const isEmailValid = email => {
  if (!email || !REGEX.EMAIL.test(email)) return false;

  return true;
};

export { isEmailValid };
