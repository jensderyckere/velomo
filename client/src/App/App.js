import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// Services
import { StylingProvider } from './services';

// Styling
import './styles/_index.scss';

// Routes
import * as Routes from './routes';

// Pages
import { Authentication } from './pages';

// Context
import * as Context from './context';

// Initializing router
const App = () => {
  return (
    <StylingProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path={Routes.HOME}>
            
          </Route>
          <Route exact path={Routes.SIGNIN}>
            <Authentication 
              auth="signin"
              quote={Context.QUOTES[0]}
            />
          </Route>
          <Route exact path={Routes.SIGNUP}>
            <Authentication 
              auth="signup"
              quote={Context.QUOTES[1]}
            />
          </Route>
          <Route exact path={Routes.RESET_PASSWORD}>
            <Authentication 
              auth="signup"
              quote={Context.QUOTES[2]}
            />
          </Route>
          <Route exact path={Routes.EDIT_PASSWORD}>
            <Authentication 
              auth="signup"
              quote={Context.QUOTES[2]}
            />
          </Route>
          <Route exact path={Routes.SUCCES_PASSWORD}>
            <Authentication 
              auth="signup"
              quote={Context.QUOTES[2]}
            />
          </Route>
        </Switch>
      </BrowserRouter>
    </StylingProvider>
  );
};

export default App;
