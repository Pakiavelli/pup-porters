const express = require('express');
const path = require('path');
const dropoffs = require('./controller/dropoffs.js');
// const puppile = require('./controller/puppile.js');
const availablePiles = require('./controller/availablePiles.js');
const claimedPiles = require('./controller/claimedPiles.js');
const signup = require('./controller/signup.js');
const user = require('./controller/user.js');
const maphelper = require('./mapHelper');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());

app.use('/dropoffs', dropoffs);
// app.use('/puppile', puppile);
app.use('/signup', signup);
app.use('/user', user);

app.use('/availablePiles', availablePiles);
app.use('/claimedPiles', claimedPiles);

app.get('/center', async (req, res) => {
  console.log(req.query.input)
  try {
    const result = await maphelper.getLongLatByPlace(req.query.input);
    console.log('get place result here:')
    console.log(result);
    res.status(200).send(result)
  } catch(error) {
    console.log('get place error here:')
    console.log(error)
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
