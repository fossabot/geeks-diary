const path = require('path');


const ROOT_PATH = path.resolve(__dirname, '../');

module.exports = {
    root(...paths) {
        return path.resolve(ROOT_PATH, ...paths);
    },

    app(...paths) {
        return path.resolve(ROOT_PATH, 'app/', ...paths);
    },

    dist(...paths) {
        return path.resolve(ROOT_PATH, 'app/dist/', ...paths);
    },

    src(...paths) {
        return path.resolve(ROOT_PATH, 'app/src/', ...paths);
    },

    nodeModules() {
        return path.resolve(ROOT_PATH, 'node_modules/');
    },

    excludes() {
        return [/node_modules/, /app\/dist/];
    }
};
