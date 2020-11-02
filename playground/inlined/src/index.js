import a from './a';
import b from './b';

export default function c(arg1, arg2) {
  return Promise.all([a(arg1), b(arg2)]);
}
