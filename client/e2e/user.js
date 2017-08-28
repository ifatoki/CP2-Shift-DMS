const faker = require('faker');

module.exports = {
  'User sign in with correct credentials': (browser) => {
    browser
      .url('http://localhost:8000/')
      .waitForElementVisible('body', 5000)
      .assert
        .containsText('p', 'Shift-DMS')
      .clearValue('#loginUserName')
      .clearValue('#loginPassword')
      .setValue('#loginUserName', 'itunuworks')
      .setValue('#loginPassword', 'itunuworks')
      .click('#login')
      .waitForElementVisible('#newDocument', 5000)
      .assert
        .containsText('#documentHeader', 'PUBLIC DOCUMENTS')
      .assert
        .urlEquals('http://localhost:8000/home')
      .pause(3000);
  },
  'Overlord should be able to see other users': (browser) => {
    browser
      .waitForElementVisible('#newDocument', 5000)
      .click('a[name="users"]')
      .waitForElementVisible('.toast-message', 5000)
      .assert
        .containsText(
          '.toast-message', 'You are now viewing users documents')
      .assert
        .visible('.userList')
      .pause(3000);
  },
  'User should be able to modify his personal details': (browser) => {
    const newUserName = faker.internet.userName();
    browser
    .waitForElementVisible('#newDocument', 5000)
    .click('#userProfile')
    .waitForElementVisible('.userManager', 5000)
    .assert
      .containsText(
        '#intro', 'ITUNULOLUWA FATOKI')
    .assert
      .containsText('#username', '@itunuworks')
    .assert
      .containsText('#email', 'itunuworks@gmail.com')
    .pause(3000)
    .click('#editButton')
    .waitForElementVisible('#editUserForm', 5000)
    .clearValue('input[name="username"]')
    .setValue('input[name="username"]', `@${newUserName}`)
    .waitForElementVisible('#saveButton', 5000)
    .click('#saveButton')
    .waitForElementVisible('.toast-message', 5000)
    .assert
      .containsText(
        '.toast-message', 'User details modified successfully')
    .pause(3000)
    .waitForElementVisible('#username', 5000)
      .assert
        .containsText(
          '#username', `@${newUserName}`)
    .waitForElementVisible('#editButton', 5000)
    .click('#editButton')
    .waitForElementVisible('#editUserForm', 5000)
    .clearValue('input[name="username"]')
    .setValue('input[name="username"]', '@itunuworks')
    .waitForElementVisible('#saveButton', 5000)
    .pause(3000)
    .click('#saveButton')
    .waitForElementVisible('.toast-message', 5000)
    .assert
      .containsText(
        '.toast-message', 'User details modified successfully')
    .waitForElementVisible('#username', 5000)
      .assert
        .containsText(
          '#username', '@itunuworks')
    .waitForElementVisible('#cancelButton', 5000)
    .click('#cancelButton')
    .pause(3000);
  },
  'User should be able to sign out': (browser) => {
    browser
      .waitForElementVisible('#logoutModal', 5000)
      .click('#logoutModal')
      .waitForElementVisible('#logout', 5000)
      .pause(1000)
      .click('#logout')
      .waitForElementVisible('#loginUserName', 5000)
      .assert
        .containsText('p', 'Shift-DMS')
      .pause(3000);
  },
  'complete tests': (browser) => {
    browser
      .end();
  }
};
