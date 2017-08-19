const faker = require('faker');

module.exports = {
  'User sign in with empty credentials': (browser) => {
    browser
      .url('http://localhost:8000/')
      .waitForElementVisible('body', 5000)
      .assert
        .containsText('p', 'Lets get you signed in')
      .setValue('#loginUserName', '')
      .setValue('#loginPassword', '')
      .click('#login')
      .waitForElementVisible('.toast-message', 5000)
      .assert
        .containsText('.toast-message', 'password is required')
      .assert
        .containsText('.toast-message', 'email or username required')
      .pause(3000);
  },
  'User sign in with blank username': (browser) => {
    browser
      .clearValue('#loginUserName')
      .pause(3000)
      .setValue('#loginPassword', faker.internet.password())
      .click('#login')
      .waitForElementVisible('.toast-message', 5000)
      .assert
        .containsText('.toast-message', 'email or username required')
      .pause(3000);
  },
  'User sign in with incorrect credentials': (browser) => {
    browser
      .setValue('#loginUserName', faker.internet.userName())
      .setValue('#loginPassword', faker.internet.password())
      .click('#login')
      .waitForElementVisible('.toast-message', 5000)
      .assert
        .containsText('.toast-message', 'user not found')
      .pause(3000)
        .setValue('#loginPassword', faker.internet.password())
        // a valid username
        .clearValue('#loginUserName')
        .setValue('#loginUserName', 'itunuworks')
      .click('#login')
      .waitForElementVisible('.toast-message', 5000)
      .assert
        .containsText('.toast-message', 'invalid password')
      .pause(3000);
  },
  'User sign in with correct credentials': (browser) => {
    browser
      .clearValue('#loginUserName')
      .clearValue('#loginPassword')
      .setValue('#loginUserName', 'itunuworks')
      .setValue('#loginPassword', 'itunuworks')
      .click('#login')
      .waitForElementVisible('#newDocument', 5000)
      .assert
        .containsText('#documentHeader', 'PUBLIC DOCUMENTS')
      .assert
        .elementPresent('.singleDocument')
      .assert
        .elementPresent('.documentList')
      .assert
        .elementNotPresent('#LoginUserName')
      .assert
        .elementPresent('.userManager')
      .assert
        .elementPresent('.documentManager')
      .assert
        .hidden('.userManager')
      .assert
        .hidden('.documentManager')
      .assert
        .urlEquals('http://localhost:8000/home')
      .pause(3000);
  },
  'complete tests': (browser) => {
    browser
      .end();
  }
};
