import { AppConfig } from './app';
import * as JSCookie from 'js-cookie';

export async function fetchGraphQL(query, token, variables) {
  const localToken = JSCookie.get('jwt');
  console.log(localToken);
  console.log(AppConfig.apiUrl);
  return fetch(AppConfig.apiUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || localToken || 'Unauthorized',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: variables || {},
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        console.log(data.errors[0].message);
        return data.data;
      }
      return data.data;
    })
    .catch(e => {
      console.error(e);
    });
}
