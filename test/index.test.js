function foo(argv) {
    console.log(argv);
}
const obj = {
    default: foo
}
const opts = (0, obj.default)(process.argvs);

function bar(a) {
    if (a) return 1;
    return 2;
}

console.log(bar(false));