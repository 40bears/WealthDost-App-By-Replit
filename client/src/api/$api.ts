import type { AspidaClient } from 'aspida';
import { dataToURLString } from 'aspida';
import type { Methods as Methods_1e7oni0 } from './auth/register';
import type { Methods as Methods_1o99gwf } from './auth/register/finalize';
import type { Methods as Methods_12kyzhw } from './auth/register/verify';
import type { Methods as Methods_11kgv2y } from './auth/username/check';

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '');
  const PATH0 = '/auth/register';
  const PATH1 = '/auth/register/finalize';
  const PATH2 = '/auth/register/verify';
  const PATH3 = '/auth/username/check';
  const POST = 'POST';

  return {
    auth: {
      register: {
        finalize: {
          post: (option: { body: Methods_1o99gwf['post']['reqBody'], config?: T | undefined }) =>
            fetch(prefix, PATH1, POST, option).send(),
          $post: (option: { body: Methods_1o99gwf['post']['reqBody'], config?: T | undefined }) =>
            fetch(prefix, PATH1, POST, option).send().then(r => r.body),
          $path: () => `${prefix}${PATH1}`,
        },
        verify: {
          post: (option: { body: Methods_12kyzhw['post']['reqBody'], config?: T | undefined }) =>
            fetch(prefix, PATH2, POST, option).send(),
          $post: (option: { body: Methods_12kyzhw['post']['reqBody'], config?: T | undefined }) =>
            fetch(prefix, PATH2, POST, option).send().then(r => r.body),
          $path: () => `${prefix}${PATH2}`,
        },
        post: (option: { body: Methods_1e7oni0['post']['reqBody'], query: Methods_1e7oni0['post']['query'], config?: T | undefined }) =>
          fetch(prefix, PATH0, POST, option).send(),
        $post: (option: { body: Methods_1e7oni0['post']['reqBody'], query: Methods_1e7oni0['post']['query'], config?: T | undefined }) =>
          fetch(prefix, PATH0, POST, option).send().then(r => r.body),
        $path: (option?: { method: 'post'; query: Methods_1e7oni0['post']['query'] } | undefined) =>
          `${prefix}${PATH0}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`,
      },
      username: {
        check: {
          post: (option: { body: Methods_11kgv2y['post']['reqBody'], config?: T | undefined }) =>
            fetch(prefix, PATH3, POST, option).send(),
          $post: (option: { body: Methods_11kgv2y['post']['reqBody'], config?: T | undefined }) =>
            fetch(prefix, PATH3, POST, option).send().then(r => r.body),
          $path: () => `${prefix}${PATH3}`,
        },
      },
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;
