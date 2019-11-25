import Dashboard from '../pages/Dashboard';
import SingIn from '../pages/SingIn';
import Page from './Pages';

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
];

export default routesList;
