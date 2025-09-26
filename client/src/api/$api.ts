import type { AspidaClient } from 'aspida';
import { dataToURLString } from 'aspida';
import type { Methods as Methods_1e7oni0 } from './auth/register';

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '');
  const PATH0 = '/auth/register';
  const POST = 'POST';

  return {
    auth: {
      register: {
        post: (option: { body: Methods_1e7oni0['post']['reqBody'], query: Methods_1e7oni0['post']['query'], config?: T | undefined }) =>
          fetch(prefix, PATH0, POST, option).send(),
        $post: (option: { body: Methods_1e7oni0['post']['reqBody'], query: Methods_1e7oni0['post']['query'], config?: T | undefined }) =>
          fetch(prefix, PATH0, POST, option).send().then(r => r.body),
        $path: (option?: { method: 'post'; query: Methods_1e7oni0['post']['query'] } | undefined) =>
          `${prefix}${PATH0}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`,
      },
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;
