const config = {
    babelConfig: {
        presets: ["@babel/preset-env", "@babel/preset-react"]
    }
};
module.exports = require("ts-jest").createTransformer(config);