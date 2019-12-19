import Dashboard from '../pages/Dashboard';
import SingIn from '../pages/SingIn';
import Page from './Pages';
import SignUp from '../pages/SingUp';

export enum RouteLayoutType {
  Authorized,
  SignUp,
  Page404
}

const routesList = [
  {
    component: Dashboard,
    path: Page.DASHBOARD,
    exact: true,
    layoutType: RouteLayoutType.Authorized
  },
  {
    component: SingIn,
    path: Page.SIGN_IN,
    exact: true,
    layoutType: RouteLayoutType.SignUp
  },
  {
    component: SignUp,
    path: Page.SIGN_UP,
    exact: true,
    layoutType: RouteLayoutType.SignUp
  },
];

export default routesList;
