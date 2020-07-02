import errorManagers from '../helpers/errorManagers';
// import errors from '../helpers/errors';

// const { documentErrors } = errors;
const { throwError } = errorManagers;

const genericHelpers = {
  resolveNull(item, errorMessage) {
    if (!item) {
      throwError(errorMessage);
    }
    return item;
  },

  resolveRightId(sharedGroup, isUser) {
    if (sharedGroup.length < 1) return -1;
    return (
      isUser ?
        sharedGroup[0].dataValues.DocumentUser.dataValues.rightId :
        sharedGroup[0].dataValues.DocumentRole.dataValues.rightId);
  }
};

export default genericHelpers;
