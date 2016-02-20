import {div, ul, li, a} from '@cycle/dom';

function Users({sources, props$}) {
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

export default Users;
