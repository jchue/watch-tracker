import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Search from './components/Search';
import Home from './views/Home';
import Movie from './views/Movie';
import Show from './views/Show';
import Season from './views/Season';
import NotFound from './views/404';

function Content() {
  const location = useLocation();

  return (
    <div className="max-w-5xl mx-auto h-full">
      <SwitchTransition>
        <CSSTransition classNames="fade" timeout={100} key={location.key} unmountOnExit appear>

          <Switch location={location}>
            <Route exact path="/" component={Home} />
            <Route exact path="/movies/:id" component={Movie} />
            <Route exact path="/shows/:showId" component={Show} />
            <Route exact path="/shows/:showId/:seasonNumber" component={Season} />
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
      <div className="App h-full flex flex-col">
        <header className="bg-white py-4 shadow-sm">
          <div className="max-w-5xl mx-auto">
            <Link to="/" className="font-bold mr-8">Watch Tracker</Link>
            <Search />
          </div>
        </header>
        <main className="pt-16 flex-grow">
          <Content />
        </main>
        <footer className="bg-gray-600 mt-16 py-8 text-sm text-white">
          <div className="max-w-5xl mx-auto text-center">
            Watch Tracker
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
