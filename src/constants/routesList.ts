import Dashboard from '../pages/Dashboard';
import SingIn from '../pages/SingIn';
import Page from './Pages';
import SingUp from '../pages/SingUp';

const routesList = [
  {
    component: Dashboard,
    path: Page.DASHBOARD,
    exact: true,
  },
  {
    component: SingIn,
    path: Page.SIGN_IN,
    exact: true,
  },
  {
    component: SingUp,
    path: Page.SIGN_UP,
    exact: true,
  },
];

export default routesList;
