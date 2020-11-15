const {
  serveBecomeMemberOrAdminView,
  serveWrongCredentialsView,
  serveCreateMessageView,
  serveHomePageView,
  serveSignupView,
  serveLoginView,
  handleBecomeMemberOrAdmin,
  handleCreateMessage,
  handleDeleteMessage,
  handleSignup,
  handleLogout,
  handleLogin,
} = require('./../controllers/index');

const { 
  catchAlreadyMemberOrAdminRequest,
  catchUnauthenticatedRequest
}  = require('./../modules/helpers');

const {
  signupValidator
} = require('./../modules/validators');

const controller  = require('./../controllers/index');
const router = require('express').Router();

router.get('/become-admin', catchUnauthenticatedRequest, catchAlreadyMemberOrAdminRequest, serveBecomeMemberOrAdminView);
router.post('/become-admin', catchUnauthenticatedRequest, handleBecomeMemberOrAdmin); 

router.get('/become-member', catchUnauthenticatedRequest, catchAlreadyMemberOrAdminRequest, serveBecomeMemberOrAdminView);
router.post('/become-member', catchUnauthenticatedRequest, handleBecomeMemberOrAdmin); 

router.get('/create-message', catchUnauthenticatedRequest, serveCreateMessageView); 
router.post('/create-message', catchUnauthenticatedRequest, handleCreateMessage); 

router.post('/delete-message', catchUnauthenticatedRequest, handleDeleteMessage);

router.get('/wrong-credentials', serveWrongCredentialsView);

router.get('/home', controller.serveHomePageView);
router.get('/', controller.serveHomePageView);

router.get('/signup', serveSignupView);
router.post('/signup', signupValidator, handleSignup);

router.get('/login', serveLoginView);
router.post('/login', handleLogin);
router.get('/logout', handleLogout);

module.exports = router;
