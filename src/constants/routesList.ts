import Dashboard from '../pages/Dashboard';
import SingIn from '../pages/SignIn';
import Page from './Pages';
import SignUp from '../pages/SignUp';
import EmailConfirmation from '../pages/EmailConfirmation';
import PersonalData from '../pages/PersonalData';
import AccountBalance from '../pages/AccountBalance';
import AccountSecurity from "../pages/AccountSecurity";
import PhoneVerification from '../pages/PhoneVerification';
import ProofOfIdentity from '../pages/ProofOfIdentity';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Withdraw from '../pages/Withdraw';
import LpLogin from '../pages/LpLogin';
import Onboarding from '../pages/Onboarding';
import BonusFAQ from '../pages/BonusFAQ';
import PageNotFound from '../pages/PageNotFound';
import AccountTypeInfo from '../pages/AccountTypeInfo';
import AccountMT from '../pages/AccountMT';


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
    layoutType: RouteLayoutType.SignFlow,
  },
  {
    component: LpLogin,
    path: Page.LP_LOGIN,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Public,
  },
  // TODO Temporary commit for waiting backend resolving
  // {
  //   component: EmailConfirmation,
  //   path: Page.EMAIL_CONFIRMATION,
  //   exact: false,
  //   strict: true,
  //   layoutType: RouteLayoutType.Public,
  // },
  {
    component: ForgotPassword,
    path: Page.FORGOT_PASSWORD,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Public,
  },
  {
    component: ResetPassword,
    path: Page.RESET_PASSWORD,
    exact: true,
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
    component: AccountSecurity,
    path: Page.ACCOUNT_SEQURITY,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized
  },
  {
    component: AccountTypeInfo,
    path: Page.ACCOUNT_TYPE_INFO,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized
  },
  {
    component: AccountMT,
    path: Page.ACCOUNT_MT5,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized
  },
  {
    component: Withdraw,
    path: Page.ACCOUNT_WITHDRAW,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized
  },
  {
    component: PersonalData,
    path: Page.PERSONAL_DATA,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.KYC,
  },
  {
    component: PhoneVerification,
    path: Page.PHONE_VERIFICATION,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.KYC,
  },
  {
    component: ProofOfIdentity,
    path: Page.PROOF_OF_IDENTITY,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.KYC,
  },
  {
    component: Onboarding,
    path: Page.ONBOARDING,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: BonusFAQ,
    path: Page.BONUS_FAQ,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized
  },
  {
    component: PageNotFound,
    path: Page.NOT_FOUND,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Page404
  },
];

export default routesList;
