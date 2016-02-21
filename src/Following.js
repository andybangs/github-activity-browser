import { div, ul, li, a, img } from '@cycle/dom';

function Following({sources, props$}) {
  const followingRequest$ = props$
    .map(username => ({
      url: 'https://api.github.com/users/' + encodeURI(username) + '/following',
      category: 'following',
    }));

  const vtree$ = sources.HTTP_FOLLOWING
    .filter(res$ => res$.request.category === 'following')
    .mergeAll()
    .map(res => res.body)
    .startWith([])
    .map(results =>
      div([
        ul({className: 'search-results'}, results.map(result =>
          li({className: 'search-result'}, [
            img({src: result.avatar_url, alt: result.login, height: "42", width: "42"}),
            a({href: result.html_url}, result.login),
          ])
        ))
      ])
    );

  return {
    DOM: vtree$,
    HTTP: followingRequest$
  };
}

export default Following;
