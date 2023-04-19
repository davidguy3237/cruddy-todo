const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const readCounterPromise = Promise.promisify(readCounter);

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};
const writeCounterPromise = Promise.promisify(writeCounter);

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  readCounterPromise()
    .then(count => writeCounterPromise(count + 1))
    .then(counterString => callback(null, counterString));

  //OLD VERSION
  // readCounter((err, count) => {
  //   if (err) {
  //     console.log('READ COUNTER ERROR');
  //   } else {
  //     writeCounter(count + 1, (err, counterString) => {
  //       callback(err, counterString);
  //     });
  //   }
  // });
};

//EXAMPLE PROMISE
// const promise1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('foo');
//   }, 300);
// });

// Promise()
//  .then()
//  .catch()


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
