const faker = require('faker');

const newTitle1 = faker.company.catchPhrase();
const newTitle2 = faker.company.catchPhrase();

module.exports = {
  'User sign in with correct credentials': (browser) => {
    browser
      .url('http://localhost:8000/')
      .waitForElementVisible('body', 5000)
      .assert
        .containsText('p', 'Lets get you signed in')
      .clearValue('#loginUserName')
      .clearValue('#loginPassword')
      .setValue('#loginUserName', 'swizz_bundle')
      .setValue('#loginPassword', 'swizz_bundle')
      .click('#login')
      .waitForElementVisible('#newDocument', 5000)
      .assert
        .containsText('#documentHeader', 'PRIVATE DOCUMENTS')
      .assert
        .urlEquals('http://localhost:8000/home')
      .pause(3000);
  },
  'User should get window to create new document': (browser) => {
    browser
      .assert
        .elementPresent('#newDocument')
      .click('#newDocument')
      .pause(1000)
      .assert
        .visible('.documentManager')
      .assert
        .containsText(
          '.intro', 'Create your document here')
      .assert
        .visible('.roleManagement')
      .assert
        .hidden('.edit.button')
      .assert
        .visible('.save.button')
      .assert
        .visible('.cancel.button')
      .pause(3000);
  },
  'User should get an error message on invalid document title': (browser) => {
    browser
      .click('.save.button')
      .waitForElementVisible('.toast-message', 5000)
      .assert
        .containsText('.toast-message', 'title is required')
      .pause(3000)
      .setValue('textarea[name="title"]', 'The President that would never be')
      .click('.save.button')
      .waitForElementVisible('.toast-message', 5000)
      .assert
        .containsText(
          '.toast-message', 'a document with that title already exists')
      .pause(3000);
  },
  'User should get a success message on successful save': (browser) => {
    const title = faker.company.catchPhrase();
    browser
      .clearValue('textarea[name="title"]')
      .setValue('textarea[name="title"]', title)
      .waitForElementVisible(
        '#private', 5000)
      .click('#private')
      .pause(2000)
      .click('.save.button')
      .waitForElementVisible('.toast-message', 5000)
      .assert
        .containsText('.toast-message', 'Document Saved')
      .pause(3000)
      .assert
        .containsText('.intro', title)
      .moveToElement('.close.button', 3, 3)
      .click('.close.button')
      .pause(3000);
  },
  'Should be able to edit documents': (browser) => {
    const title = faker.company.catchPhrase();
    browser
      .waitForElementVisible('#newDocument', 5000)
      .click('.cancel.button')
      .pause(2000)
      .click('a[name="private"]')
      .waitForElementVisible('.singleDocument', 5000)
      .click('.singleDocument')
      .pause(3000)
      .assert
        .visible('.documentManager')
      .click('.edit.button')
      .waitForElementVisible('textarea[name="title"]', 5000)
      .assert
        .visible('textarea[name="title"]')
      .clearValue('textarea[name="title"]')
      .setValue('textarea[name="title"]', title)
      .click('.save.button')
      .waitForElementVisible('.toast-message', 5000)
      .assert
        .containsText('.toast-message', 'Document Saved')
      .pause(3000)
      .assert
        .containsText('.intro', title)
      .click('.close.button')
      .pause(3000);
  },
  'Should be able to delete his documents': (browser) => {
    browser
      .waitForElementVisible('#newDocument', 5000)
      .click('a[name="private"]')
      .waitForElementVisible('.singleDocument', 5000)
      .pause(3000)
      .click('.deleteDocument')
      .waitForElementVisible('.toast-message', 5000)
      .assert
        .containsText('.toast-message', 'Document Deleted')
      .pause(3000)
      .click('a[name="role"]')
      .pause(3000)
      .click('.deleteDocument')
      .waitForElementVisible('.toast-message', 5000)
      .assert
        .containsText(
          '.toast-message', "you don't have the rights to delete this document")
      .pause(3000);
  },
  'Should be able to view different categories of documents': (browser) => {
    browser
      .waitForElementVisible('#newDocument', 5000)
      .click('a[name="private"]')
      .waitForElementVisible('.toast-message', 5000)
      .assert
        .containsText('.toast-message', 'You are now viewing private documents')
      .pause(3000)
      .click('a[name="public"]')
      .waitForElementVisible('.toast-message', 5000)
      .assert
        .containsText('.toast-message', 'You are now viewing public documents')
      .pause(3000)
      .click('a[name="role"]')
      .waitForElementVisible('.toast-message', 5000)
      .assert
        .containsText('.toast-message', 'You are now viewing role documents')
      .pause(3000);
  },
  'Should be able to search through documents he has access to': (browser) => {
    browser
      .waitForElementVisible('#newDocument', 5000)
      .click('#newDocument')
      .waitForElementVisible('textarea[name="title"]', 5000)
      .clearValue('textarea[name="title"]')
      .setValue('textarea[name="title"]', newTitle1)
      .click('.save.button')
      .moveToElement('.close.button', 3, 3)
      .click('.close.button')
      .pause(3000)
      .waitForElementVisible('#newDocument', 5000)
      .click('#newDocument')
      .waitForElementVisible('textarea[name="title"]', 5000)
      .clearValue('textarea[name="title"]')
      .setValue('textarea[name="title"]', newTitle2)
      .click('.save.button')
      .moveToElement('.close.button', 3, 3)
      .click('.close.button')
      .pause(3000)
      .waitForElementVisible('.ui.icon.input input', 5000)
      .setValue('.ui.icon.input input', newTitle1)
      .waitForElementVisible('.ui.category.search>.results .category', 5000)
      .assert
        .containsText('.ui.category.search>.results .category>.name',
          ('authored' || 'public'))
      .assert
        .containsText(
          '.ui.category.search>.results .category:first-child .name+.result',
          newTitle1)
      .pause(3000);
  },
  'complete tests': (browser) => {
    browser
      .end();
  }
};
