import { div, label, input, hr, a, img } from '@cycle/dom';
import Following from './Following';
import Starred from './Starred';

function App(sources) {
  const targetVal$ = sources.DOM.select('.field').events('input')
    .debounce(500)
    .map(ev => ev.target.value)
    .filter(query => query.length > 0);

  const following = Following({sources, props$: targetVal$ });
  const starred = Starred({sources, props$: targetVal$ });

  const userRequest$ = targetVal$
    .map(username => ({
      url: 'https://api.github.com/users/' + encodeURI(username),
      category: 'user',
    }));

  const vtree$ = sources.HTTP_USER
    .filter(res$ => res$.request.category === 'user')
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
        following.DOM,
        hr(),
        starred.DOM,
      ])
    );

  return {
    DOM: vtree$,
    HTTP_USER: userRequest$,
    HTTP_FOLLOWING: following.HTTP,
    HTTP_STARRED: starred.HTTP,
  };
}

export default App;
