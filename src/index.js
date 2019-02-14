#!/usr/bin/env node

console.log("*******************HELLO THERE***************");
function listDirectory(targetPath, parentNode) {
    var files = fs.readdirSync(targetPath, {
        withFileTypes: true
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

function FileNode(type, name, absolutePath) {
    this.type = type;
    this.name = name;
    this.absolutePath = absolutePath;
    if (type === 'DIR') {
        this.children = [];
    }
}

var path = require('path');
const fs = require('fs');

var argvs = process.argv.slice(2);
var targetPath = process.cwd();
if (argvs.length) {
    targetPath = argvs[0];
}
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
// fs.writeFileSync(process.cwd() + path.sep + root.name + '.json', JSON.stringify(root));
console.log(root);
console.log("*******************SUCCESS***************");