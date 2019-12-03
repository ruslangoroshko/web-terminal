import Dashboard from '../pages/Dashboard';
import SingIn from '../pages/SingIn';
import Page from './Pages';
import SignUp from '../pages/SingUp';

const routesList = [
  {
    component: Dashboard,
    path: Page.DASHBOARD,
    exact: true,
    authRequired: true,
  },
  {
    component: SingIn,
    path: Page.SIGN_IN,
    exact: true,
    authRequired: false,
  },
  {
    component: SignUp,
    path: Page.SIGN_UP,
    exact: true,
    authRequired: false,
  },
];

export default routesList;
