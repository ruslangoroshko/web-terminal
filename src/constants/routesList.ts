import Dashboard from '../pages/Dashboard';
import SingIn from '../pages/SingIn';
import Page from './Pages';
import SignUp from '../pages/SingUp';
import EmailConfirmation from '../pages/EmailConfirmation';

export enum RouteLayoutType {
  Authorized,
  SignFlow,
  Public,
  Page404,
}

const routesList = [
  {
    component: SingIn,
    path: Page.SIGN_IN,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.SignFlow,
  },
  {
    component: SignUp,
    path: Page.SIGN_UP,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Public,
  },
  {
    component: EmailConfirmation,
    path: Page.EMAIL_CONFIRMATION,
    exact: false,
    strict: true,
    layoutType: RouteLayoutType.Public,
  },
  {
    component: Dashboard,
    path: Page.DASHBOARD,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
];

export default routesList;
