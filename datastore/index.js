var Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('ERROR COULDNT GET UNIQUE ID');
    } else {
      let newPath = path.join(exports.dataDir, `${id}.txt`);
      let newDate = new Date().toString();
      let newObj = {
        id: id,
        text: text,
        createDate: newDate,
        updateDate: null,
      };
      let stringified = JSON.stringify(newObj);
      fs.writeFileAsync(newPath, stringified)
        .then(() => callback(err, newObj));
    }
  });

};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('ERROR', err);
      return callback(err);
    } else {
      let contents = files.map(file => {
        let fileLocation = path.join(exports.dataDir, file);
        let id = path.basename(file, '.txt');
        return fs.readFileAsync(fileLocation)
          .then(fileData => JSON.parse(fileData));
      });
      Promise.all(contents)
        .then((items) => {
          callback(err, items);
        });
    }
  });
};

exports.readOne = (id, callback) => {
  let newPath = path.join(exports.dataDir, `${id}.txt`);

  fs.readFileAsync(newPath)
    .then(fileData => callback(null, JSON.parse(fileData)))
    .catch(err => callback(err));

};

exports.update = (id, text, callback) => {
  let newPath = path.join(exports.dataDir, `${id}.txt`);

  exports.readOne(id, (err, todo) => {
    if (err) {
      console.log('ERROR: CANNOT FIND ID');
      callback(err);
    } else {
      let updatedObj = Object.assign({}, todo);
      updatedObj.text = text;
      updatedObj.updateDate = new Date().toString();
      let stringified = JSON.stringify(updatedObj);
      fs.writeFileAsync(newPath, stringified)
        .then(() => callback(null, updatedObj))
        .catch(err => console.log(err));
    }
  });
};

exports.delete = (id, callback) => {
  let newPath = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(newPath, (err) => callback(err));
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};