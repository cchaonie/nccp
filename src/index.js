#!/usr/bin/env node

console.log('*******************HELLO THERE***************');

const path = require('path');
const fs = require('fs');
const program = require('commander');

class FileNode {
  constructor(type, name, absolutePath) {
    this.type = type;
    this.name = name;
    this.absolutePath = absolutePath;
    if (type === 'DIR') {
      this.children = [];
    }
  }
}

function listDirectoryOrFileRecursive(targetPath) {
  var absoluteTargetPath = path.resolve(targetPath);
  var rootDir = path.parse(absoluteTargetPath);
  var root;
  var stats = fs.statSync(absoluteTargetPath);
  if (stats.isDirectory()) {
    root = new FileNode('DIR', rootDir.base, absoluteTargetPath);
    root = listDirectory(absoluteTargetPath, root);
  } else if (stats.isFile()) {
    root = new FileNode('FILE', rootDir.base, absoluteTargetPath);
  }
  return root;
}

function listDirectory(targetPath, parentNode) {
  var files = fs.readdirSync(targetPath, {
    withFileTypes: true,
  });
  for (var f of files) {
    var current;
    if (f.isDirectory()) {
      var newPath = targetPath + path.sep + f.name;
      current = new FileNode('DIR', f.name, path.resolve(newPath));
      listDirectory(targetPath + path.sep + f.name, current);
    } else if (f.isFile()) {
      current = new FileNode('FILE', f.name, path.resolve(targetPath, f.name));
    }
    parentNode.children.push(current);
  }
  return parentNode;
}

program.version('0.0.3').usage('<command> [options]');

program
  .command('list [dir]')
  .alias('ls')
  .description('list all the files and folders in current directory')
  .action(function (dir) {
    const result = listDirectoryOrFileRecursive(dir);
    console.log(result);
  });

program.parse(process.argv);
console.log('*******************SUCCESS***************');
