import Cycle from '@cycle/core';
import {Observable} from 'rx';
import {div, label, input, hr, a, img, makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import Users from './Users';
import Repos from './Repos';

function main(sources) {
  const targetVal$ = sources.DOM.select('.field').events('input')
    .debounce(500)
    .map(ev => ev.target.value)
    .filter(query => query.length > 0);

  const users = Users({sources, props$: targetVal$ });
  const repos = Repos({sources, props$: targetVal$ });

  const searchRequest$ = targetVal$
    .map(username => ({
      url: 'https://api.github.com/users/' + encodeURI(username),
      category: 'github',
    }));

  const vtree$ = sources.HTTP_USER
    .filter(res$ => res$.request.category === 'github')
    .mergeAll()
    .map(res => res.body)
    .startWith({})
    .map(result =>
      div([
        label({className: 'label'}, 'Search:'),
        input({className: 'field', attributes: {type: 'text'}}),
        hr(),
        img({src: result.avatar_url, alt: result.login, height: "42", width: "42"}),
        a({href: result.html_url}, result.login),
        hr(),
        users.DOM,
        hr(),
        repos.DOM,
      ])
    );

  return {
    DOM: vtree$,
    HTTP_USER: searchRequest$,
    HTTP_FOLLOWING: users.HTTP,
    HTTP_STARRED: repos.HTTP,
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#main-container'),
  HTTP_USER: makeHTTPDriver(),
  HTTP_FOLLOWING: makeHTTPDriver(),
  HTTP_STARRED: makeHTTPDriver(),
});
