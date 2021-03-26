import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// Services
import { StylingProvider, AuthProvider, ToolboxProvider, ApiProvider } from './services';

// Styling
import 'video-react/dist/video-react.css';
import 'react-rangeslider/lib/index.css';
import './styles/_index.scss';

// Routes
import * as Routes from './routes';

// Pages
import { Activities, Activity, AddConnection, Authentication, CallbackStrava, Challenge, Challenges, CreateActivity, CreateChallenge, CreateEvent, CreateGoal, Dashboard, EditActivity, EditChallenge, EditGoal, Events, Goal, Goals, MyProfile, MyProfileSettings, Notifications, Profile, Submissions, Event, EditEvent } from './pages';

// Context
import * as Context from './context';

// Utils
import { NeedsAuth, CheckIfPopup } from './utils';

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
                <CheckIfPopup>
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
                    <Route exact path={Routes.PROFILE}>
                      <NeedsAuth>
                        <Profile />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.SETTINGS}>
                      <NeedsAuth>
                        <MyProfileSettings />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.ADD_CONNECTION}>
                      <NeedsAuth>
                        <AddConnection />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.ACTIVITY}>
                      <NeedsAuth>
                        <Activity />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.CREATE_ACTIVITY}>
                      <NeedsAuth>
                        <CreateActivity />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.EDIT_ACTIVITY}>
                      <NeedsAuth>
                        <EditActivity />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.ACTIVITIES}>
                      <NeedsAuth>
                        <Activities />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.CREATE_CHALLENGE}>
                      <NeedsAuth>
                        <CreateChallenge />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.EDIT_CHALLENGE}>
                      <NeedsAuth>
                        <EditChallenge />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.CHALLENGE}>
                      <NeedsAuth>
                        <Challenge />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.CHALLENGES}>
                      <NeedsAuth>
                        <Challenges />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.SUBMISSIONS}>
                      <NeedsAuth>
                        <Submissions />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.NOTIFICATIONS}>
                      <NeedsAuth>
                        <Notifications />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.GOALS}>
                      <NeedsAuth>
                        <Goals />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.GOAL}>
                      <NeedsAuth>
                        <Goal />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.CREATE_GOAL}>
                      <NeedsAuth>
                        <CreateGoal />
                      </NeedsAuth>
                    </Route>
                    <Route exact path={Routes.EDIT_GOAL}>
                      <NeedsAuth>
                        <EditGoal />
                      </NeedsAuth>
                    </Route>
                    <Route path={Routes.STRAVA_CALLBACK}>
                      <NeedsAuth>
                        <CallbackStrava />
                      </NeedsAuth>
                    </Route>
                    <Route path={Routes.EVENTS}>
                      <NeedsAuth>
                        <Events />
                      </NeedsAuth>
                    </Route>
                    <Route path={Routes.CREATE_EVENT}>
                      <NeedsAuth>
                        <CreateEvent />
                      </NeedsAuth>
                    </Route>
                    <Route path={Routes.EVENT}>
                      <NeedsAuth>
                        <Event />
                      </NeedsAuth>
                    </Route>
                    <Route path={Routes.EDIT_EVENT}>
                      <NeedsAuth>
                        <EditEvent />
                      </NeedsAuth>
                    </Route>
                  </StandardLayout>
                </CheckIfPopup>
              </Switch>
            </BrowserRouter>
          </StylingProvider>
        </ApiProvider>
      </AuthProvider>
    </ToolboxProvider>
  );
};

export default App;
