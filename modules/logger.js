const print = function (category, message, func) {
    func(`${new Date().toISOString()}: [${category}] ${message}`);
}

// uporabljaj za izpis v konzolo
module.exports = {
    log: (cat, msg) => print(cat, msg, console.log),
    debug: (cat, msg) => print(cat, msg, console.debug),
    warn: (cat, msg) => print(cat, msg, console.warn),
    trace: (cat, msg) => print(cat, msg, console.trace),
    error: (cat, msg) => print(cat, msg, console.error),
};