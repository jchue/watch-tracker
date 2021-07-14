import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './App.scss';
import Search from './components/Search';
import Home from './views/Home';
import Movie from './views/Movie';
import Show from './views/Show';
import NotFound from './views/404';

function Content() {
  const location = useLocation();

  return (
    <div className="wrapper">
      <SwitchTransition>
        <CSSTransition classNames="fade" timeout={100} key={location.key} unmountOnExit appear>

          <Switch location={location}>
            <Route exact path="/" component={Home} />
            <Route exact path="/movies/:id" component={Movie} />
            <Route exact path="/shows/:id" component={Show} />
            <Route path="*" component={NotFound} />
          </Switch>

        </CSSTransition>
      </SwitchTransition>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header id="site-header">
          <div className="wrapper">
            <Link to="/" id="site-title">Watch Tracker</Link>
            <Search />
          </div>
        </header>
        <main id="site-content">
          <Content />
        </main>
      </div>
    </Router>
  );
}

export default App;
