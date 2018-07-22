'use strict'

const cheerio       = require('cheerio');
const PluginError   = require('plugin-error');
const through       = require('through2');
const path          = require('path');
const fs            = require('fs');

// Use when developing locally:
// const langPath = "node_modules/prismjs/"; 
const langPath = "../prismjs/";
const normalizedPath = path.join(__dirname, langPath);

function getAllLanguages() {
    let languagesToLoad = [];
    fs.readdirSync(normalizedPath + "components/").forEach( file => {
        if (/^.+\.min\.(js)$/i.test(file)) {
            let languageName = file.replace('prism-', '').replace('.min.js', '');
            if (languageName !== 'core'){
                languagesToLoad.push(languageName);
            }
        }
    });
    return languagesToLoad;
}

const Prism = require(`${normalizedPath}/components/prism-core.js`);
const loadLanguages = require(`${normalizedPath}/components/index.js`);
loadLanguages(getAllLanguages());

const packageName   = require('./package.json').name;
const defaultConfig = {
    selector: 'pre code',
    cheerio: {
        decodeEntities: false,
    }
}

const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
}

function escapeHTML(HTMLString) {
    return String(HTMLString).replace(/[&<>"'`=\/]/g, s => entityMap[s]);
}

function highlight(text, config) {
    const $ = cheerio.load(text, config.cheerio);

    $(config.selector)
        .each((i, el) => {
            const langPrefixRegex = /\blang(?:uage)?-([\w-]+)\b/i;
            const blockClasses = $(el).attr('class') ? $(el).attr('class').split(' ') : [];
            let hasLangClass = false;
            let language = '';

            for (let i = 0; i < blockClasses.length; i++) {
                let match = blockClasses[i].match(langPrefixRegex);
                if (match) {
                    hasLangClass = true;
                    language = match[1].toLowerCase();
                }
            }

            const prismLangObj = Prism.languages[language];

            if(hasLangClass && language && prismLangObj) {
                $(el).text(Prism.highlight($(el).html(), prismLangObj)).addClass('prism');
            } else {
                $(el).text(escapeHTML($(el).text())).addClass('no-prism');
            }
        });

    return $.html() || text;
}

module.exports = (options) => {
    const config = Object.assign({}, defaultConfig, options)

    return through.obj(function (file, encoding, done) {
        if (file.isNull()) {
            return done(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(packageName, 'Streams not supported!'));
            return done();
        }

        try {
            const text = file.contents.toString();
            file.contents = Buffer.from(highlight(text, config));
        } catch (error) {
            this.emit('error', new PluginError(packageName, error));
        }

        done(null, file);
    })
}
