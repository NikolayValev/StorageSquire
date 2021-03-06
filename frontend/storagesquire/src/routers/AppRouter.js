import React from "react";
import { BrowserRouter as Router, Route, Routes/*Switch*/ } from "react-router-dom";
import LoginPage from "../components/LoginPage"
import { createBrowserHistory } from "history"
import HomePage from "../components/Homepage"
import SettingsPage from "../components/SettingsPage";
/*
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import DownloadPage from "../components/DownloadPage";
import VerifyEmailPage from "../components/VerifyEmailPage";
import uuid from "uuid"
import ResetPasswordPage from "../components/ResetPasswordPage";
import GoogleAccountPage from "../components/GoogleAccountPage";
import AddStoragePage from "../components/AddStoragePage";
*/
export const history = createBrowserHistory()
/*
const AppRouter = () => (

  <Router history={history} >

    <Switch>
      <Route path="/" exact={true} component={LoginPage} />
      <Route key={1} path="/home" component={HomePage} />
      <Route path="/download-page/:id/:tempToken" component={DownloadPage} />
      <Route key={1} path="/folder/:id" component={HomePage} />
      <Route key={1} path="/folder-google/:id" component={HomePage} />
      <Route key={1} path="/folder-personal/:id" component={HomePage} />
      <Route key={1} path="/search/:id" component={HomePage} />
      <Route path="/verify-email/:id" component={VerifyEmailPage} />
      <Route path="/reset-password/:id" component={ResetPasswordPage} />
      <Route path="/add-google-account" component={GoogleAccountPage} />
      <Route path="/add-storage" component={AddStoragePage} />
      <Route path="/settings" component={SettingsPage} />
    </Switch>

  </Router>
)
*/
const AppRouter = () => (

  <Router history={history} >
    <Routes>
      <Route path="/" exact={true} element={<LoginPage />} />
      <Route key={1} path="/home" element={<HomePage />} />
      <Route path="/settings" element={SettingsPage} />
    </Routes>

  </Router>
)
export default AppRouter;
