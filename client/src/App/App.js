import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// Services
import { StylingProvider, AuthProvider, ToolboxProvider, ApiProvider } from './services';

// Styling
import './styles/_index.scss';

// Routes
import * as Routes from './routes';

// Pages
import { Authentication, Dashboard, MyProfile, MyProfileSettings } from './pages';

// Context
import * as Context from './context';

// Utils
import { NeedsAuth } from './utils';

// Layouts
import { StandardLayout } from './layouts';

// Initializing router
const App = () => {
  return (
    <ToolboxProvider>
      <AuthProvider>
        <ApiProvider>
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
                <Route exact path={Routes.SIGNUP_ROLE}>
                  <Authentication 
                    auth="signup-role"
                    quote={Context.QUOTES[1]}
                  />
                </Route>
                <Route exact path={Routes.RESET_PASSWORD}>
                  <Authentication 
                    auth="reset-password"
                    quote={Context.QUOTES[2]}
                  />
                </Route>
                <Route exact path={Routes.EDIT_PASSWORD}>
                  <Authentication 
                    auth="edit-password"
                    quote={Context.QUOTES[2]}
                  />
                </Route>
                <Route exact path={Routes.SUCCES_PASSWORD}>
                  <Authentication 
                    auth="success-password"
                    quote={Context.QUOTES[2]}
                  />
                </Route>
                <StandardLayout>
                  <Route exact path={Routes.DASHBOARD}>
                    <NeedsAuth>
                      <Dashboard />
                    </NeedsAuth>
                  </Route>
                  <Route exact path={Routes.MY_PROFILE}>
                    <NeedsAuth>
                      <MyProfile />
                    </NeedsAuth>
                  </Route>
                  <Route exact path={Routes.SETTINGS}>
                    <NeedsAuth>
                      <MyProfileSettings />
                    </NeedsAuth>
                  </Route>
                </StandardLayout>
              </Switch>
            </BrowserRouter>
          </StylingProvider>
        </ApiProvider>
      </AuthProvider>
    </ToolboxProvider>
  );
};

export default App;
