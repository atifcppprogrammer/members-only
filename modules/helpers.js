const assignPermissionTo = (document, user) => {
  delete document._id;
  if (!user) { delete document.user; return document; }
  if (!(user.isAdmin || user.isMember || document.user === user.username))
    delete document.user;
  if (user.isAdmin || (user.isMember && document.user === user.username))
    document.canBeDeleted = true;
  return document;
}

const getRandomAvatarForUser = () => {
  const list = [ 'alien', 'clown', 'cowboy', 'devil', 'evil', 'ghost' ];
  return { avatar: list[Math.floor(Math.random() * list.length)] };
}

const getDateForMessage = () => {
  const dateObject = new Date();
  const month = dateObject.getMonth() + 1;
  const year  = dateObject.getFullYear();
  const date  = dateObject.getDate();
  const dateString = `${year}-${month}-${date}`;

  const asUTC = dateObject.toUTCString();
  const timeString = asUTC.split(' ')[4].split(':').slice(0,2).join(':');
  return `${dateString} @ ${timeString}`;
  
}

exports.assignPermissionsTo = (messages, user) => 
  messages.map(document => assignPermissionTo(document, user));

exports.getUserDocumentFor = (username, hashedPassword) => ({
  password: hashedPassword, username, isMember: false, isAdmin: false,
  ...getRandomAvatarForUser()
});

exports.getMessageDocumentFor = (title, message, user) => ({
  title, message, date: getDateForMessage(), ...user
});

exports.messages = {
  alreadyExists: 'A user with that username already exists !!!',
  incorrectPassword: 'The provided password is incorrect !!!',
  serverErrorOccured: 'Something went wrong contact developer !!!',
  usernameLengthError: 'Username must be at least 8 characters long !!!',
  passwordLengthError: 'Password must be at least 8 characters long !!!',
  passwordUnconfirmed: 'Passwords dont match try again mate !!!'
};

exports.getMessageForSignupUnsuccessful = validationErrors => {
  const { param } = validationErrors.shift();
  
  if (param === 'username') return this.messages.usernameLengthError;
  if (param === 'password') return this.messages.passwordLengthError;
  return this.messages.passwordUnconfirmed;
}

exports.renderTemplate = (res, template, data, onlyCSS = true) => {
  const resources = { stylesheet:`${template}` };
  if (!onlyCSS) resources.javascript = `${template}`;
  const populateWith = { ...resources, ...data };
  res.render(template, populateWith);
}

exports.catchUnauthenticatedRequest = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  const populateWith = { title: 'Unauthorized' };
  res.status(401);
  this.renderTemplate(res,'userUnauthorized', populateWith);
}

exports.catchAlreadyMemberOrAdminRequest = (req, res, next) => {
  const string = req.path.split('/').pop().split('-').pop();
  const become = string === 'member' ? 'Member' : 'Admin';

  const userKey = `is${become}`;
  if (!req.user[userKey]) return next();
  const populateWith = { title:`Already ${become}`, become };
  this.renderTemplate(res, 'alreadyMemberOrAdmin', populateWith);
}
