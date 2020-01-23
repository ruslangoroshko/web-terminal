import Dashboard from '../pages/Dashboard';
import SingIn from '../pages/SingIn';
import Page from './Pages';
import SignUp from '../pages/SingUp';
import EmailConfirmation from '../pages/EmailConfirmation';

export enum RouteLayoutType {
  Authorized,
  SignFlow,
  Page404,
}

const routesList = [
  {
    component: Dashboard,
    path: Page.DASHBOARD,
    exact: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: SingIn,
    path: Page.SIGN_IN,
    exact: true,
    layoutType: RouteLayoutType.SignFlow,
  },
  {
    component: SignUp,
    path: Page.SIGN_UP,
    exact: true,
    layoutType: RouteLayoutType.SignFlow,
  },
  {
    component: EmailConfirmation,
    path: Page.EMAIL_CONFIRMATION,
    exact: false,
    layoutType: RouteLayoutType.SignFlow,
  },
];

export default routesList;
