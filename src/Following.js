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
    .map(results => {
      const sortedResults = results
        .map(user => {
          return Object.assign({}, {
            login: user.login.toLowerCase(),
            avatar_url: user.avatar_url,
            html_url: user.html_url,
          });
        })
        .sort((a, b) => {
          if (a.login > b.login) return 1;
          if (a.login < b.login) return -1;
          return 0;
        });

      return div({}, [
        ul({style: styles.ul}, sortedResults.map(result =>
          li({style: styles.li}, [
            img({src: result.avatar_url, alt: result.login, height: "42", width: "42"}),
            a({style: styles.a, href: result.html_url}, result.login),
          ])
        ))
      ])
    });

  const styles = {
    ul: {
      display: 'flex',
      flexFlow: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      alignContent: 'space-around',
      padding: '5px',
    },
    li: {
      listStyle: 'none',
      padding: '5px',
      margin: '5px',
      borderRadius: '2px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#90A6C1',
    },
    a: {
      textDecoration: 'none',
      color: '#444343',
    }
  };

  return {
    DOM: vtree$,
    HTTP: followingRequest$
  };
}

export default Following;
