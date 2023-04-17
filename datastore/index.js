const fs = require('fs');
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

      fs.writeFile(newPath, text, (err) => {
        if (err) {
          console.log('write File ERROR:', err);
        } else {
          callback(err, {text: text, id: id});
        }
      });

    }
  });

};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      let output = files.map(file => {
        return {id: file.slice(0, 5), text: file.slice(0, 5)};
      });
      callback(err, output);
    }
  });
};

exports.readOne = (id, callback) => {
  let newPath = path.join(exports.dataDir, `${id}.txt`);

  fs.readFile(newPath, (err, fileData) => {
    if (err) {
      callback(err, {});
    } else {
      callback(err, {id: id, text: fileData.toString()});
    }
  });

};

exports.update = (id, text, callback) => {
  let newPath = path.join(exports.dataDir, `${id}.txt`);

  exports.readOne(id, (err, todo) => {
    if (err) {
      console.log('ERROR: CANNOT FIND ID');
      callback(err, {});
    } else {
      fs.writeFile(newPath, text, (err) => {
        if (err) {
          console.log('Failed to update.');
        } else {
          callback(err, {id: id, text: text});
        }
      });
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
