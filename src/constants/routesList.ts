import Dashboard from '../pages/Dashboard';
import SingIn from '../pages/SingIn';
import Page from './Pages';
import SignUp from '../pages/SingUp';
import EmailConfirmation from '../pages/EmailConfirmation';
import PersonalData from '../pages/PersonalData';
import MobileTradingView from '../pages/MobileTradingView';
import AccountBalance from '../pages/AccountBalance';

export enum RouteLayoutType {
  Authorized,
  SignFlow,
  Public,
  KYC,
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
  {
    component: AccountBalance,
    path: Page.ACCOUNT_BALANCE_HISTORY,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: PersonalData,
    path: Page.PERSONAL_DATA,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.KYC,
  },
  {
    component: MobileTradingView,
    path: Page.MOBILE_TRADING_VIEW,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Public,
  },
];

export default routesList;
