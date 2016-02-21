import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import App from './App';

run(App, {
  DOM: makeDOMDriver('#container'),
  HTTP_USER: makeHTTPDriver(),
  HTTP_FOLLOWING: makeHTTPDriver(),
  HTTP_STARRED: makeHTTPDriver(),
});
