import { div, span, input, hr, a, img, p } from '@cycle/dom';
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
    .map(result => {
      const avatar = result.avatar_url ?
        img({src: result.avatar_url, alt: result.login, height: "42", width: "42"}) :
        '';

      return div({style: styles.container}, [
        div({style: styles.header}, [
          div({style: styles.edge},
            input({style: styles.input,
              className: 'field',
              attributes: {type: 'text', placeholder: 'GitHub Username'}
            }),
          ),
          span({style: styles.title}, 'Activity Browser'),
          div({style: styles.edge}, avatar)
        ]),
        div({style: styles.body}, [
          following.DOM,
          starred.DOM,
        ]),
      ])
    });

  const styles = {
    container: {
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'stretch',
    },
    header: {
      height: '10%',
      display: 'flex',
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: '#DEDEDE',
    },
    body: {
      height: '90%',
      display: 'flex',
      flexFlow: 'row',
      alignItems: 'stretch',
      justifyContent: 'space-around',
      backgroundColor: '#F5F5F5',
    },
    title: {
      textAlign: 'center',
      fontSize: '1.5em',
    },
    input: {
      padding: '3px',
    },
    edge: {
      minWidth: '170px',
      display: 'flex',
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  return {
    DOM: vtree$,
    HTTP_USER: userRequest$,
    HTTP_FOLLOWING: following.HTTP,
    HTTP_STARRED: starred.HTTP,
  };
}

export default App;
