const axios = require('axios');
const bcrypt = require('bcryptjs');
const tokenGen = require('../auth/tokenGen.js');


const { authenticate } = require('../auth/authenticate');
const Users = require('../users/user-model.js');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  Users.add(user)
  .then(newUser => {
    const token = tokenGen.generateToken(newUser);
    res.status(201).json({newUser, token});
  })
  .catch(error => {
    res.status(500).json(error)
  })
}

  function login(req, res) {
    let {username, password} = req.body;
    Users.findBy({username})
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
      const token = tokenGen.generateToken(user);
      res.status(200).json({message: `Welcome ${user.username}!, token granted`,
    token,});
    } else {
      res.status(401).json({message: 'Invalid Credentials, cannot enter'});
    }
  })
  .catch(error => {
    res.status(500).json(error);
  });
}

// server.delete('/', (req, res) => {
//   if (req.session) {
//     req.session.destroy();
//     res.status(200).json({message: 'Good Luck on your journey, young Jedi, see you next time'});
//   }
// })
  
// function getUsers(req, res) {
//   Users.find()
//   .then(users => {
//     res.json(users);
//   })
//   .catch(err => res.send(err))
// }

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };


  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });

  }

  