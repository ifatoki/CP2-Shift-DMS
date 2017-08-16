module.exports = {
  'User sign in without credentials': (browser) => {
    browser
      .url('http://localhost:8000/')
      .waitForElementVisible('body', 5000)
      .setValue('input[name=email]', '')
      .setValue('input[name=password]', '')
      .click('#login')
      .waitForElementVisible('p', 5000)
      .assert
        .containsText('p', 'Lets get you signed in')
      .end();
  },
  // 'User sign in with wrong email': (browser) => {
  //   browser
  //     .url('http://localhost:8080/login')
  //     .waitForElementVisible('body', 2000)
  //     .setValue('input[name=email]', 'I do not exist')
  //     .setValue('input[name=password]', 'password123')
  //     .click('.btn-login')
  //     .waitForElementVisible('h4', 5000)
  //     .assert.containsText('h4', 'Login');
  // },
  // 'User sign in with wrong password': (browser) => {
  //   browser
  //     .url('http://localhost:8080/login')
  //     .waitForElementVisible('body', 5000)
  //     .setValue('input[name=email]', 'thePiper')
  //     .setValue('input[name=password]', 'a very wrong password')
  //     .click('.btn-login')
  //     .waitForElementVisible('h4', 5000)
  //     .assert.elementPresent('h4', 'Login');
  // },
  // 'User sign in success': (browser) => {
  //   browser
  //     .url('http://localhost:8080/login')
  //     .waitForElementVisible('body', 5000)
  //     .click('.btn-login')
  //     .setValue('input[name=email]', 'anthony@andela.com')
  //     .setValue('input[name=password]', 'anthony')
  //     .click('.btn-login')
  //     .waitForElementVisible('div[id="dashboardBG"]', 5000)
  //     .assert.containsText('h4', 'DASHBOARD')
  //     .assert.urlEquals(`${'http://localhost:8080/'}`)
  //     .end();
  // },
};
