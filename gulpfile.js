var fs = require("fs");
var gulp = require('gulp');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var mappings = require('./src/mappings.json');

var colors = {
    defaultFg: "424242",
    defaultBg: "F6F6F6",
    defaultBg2: "F0EFF1",
    defaultBg3: "EFEEF0",
    lightFg: "656565",
    lightBg: "F3F3F3",
    darkFg: "C5C5C5",
    darkBg: "252526"
};

gulp.task('saveDark', function () {
    return gulp.src([
        'src/svg/*.svg'
    ])
        .pipe(replace(colors.defaultFg, colors.darkFg))
        .pipe(replace(colors.defaultBg, colors.darkBg))
        .pipe(replace(colors.defaultBg2, colors.darkBg))
        .pipe(replace(colors.defaultBg3, colors.darkBg))
        .pipe(rename(function (path) {
            path.basename += "_inverse";
        }))
        .pipe(gulp.dest('fileicons/images'));
});

gulp.task('saveLight', function () {
    return gulp.src([
        'src/svg/*.svg'
    ])
        .pipe(replace(colors.defaultFg, colors.lightFg))
        .pipe(replace(colors.defaultBg, colors.lightBg))
        // .pipe(replace(colors.defaultBg2, colors.lightBg))
        // .pipe(replace(colors.defaultBg3, colors.lightBg))
        .pipe(gulp.dest('fileicons/images'));
});

gulp.task('generateMappings', function () {
    var savePath = "./fileicons/";
    var themeSettings = {
        iconDefinitions: {}
    };

    themeSettings.iconDefinitions = createDefinitionsObj();
    Object.assign(themeSettings, createDarkThemeObj());
    themeSettings.light = createLightThemeObj();

    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath);
    }

    fs.writeFile(savePath + 'vscode-icon-theme.json', JSON.stringify(themeSettings), function (err) {
        if (err) return console.log(err);
    });

    createTestFiles();

});

gulp.task('generateIcons', ['saveDark', 'saveLight']);


function createDefinitionsObj() {
    var defs = {};
    var relPath = mappings.settings.iconRelPath;
    var darkPostfix = mappings.settings.darkTheme.postfix;
    var iconExtension = mappings.settings.iconFileExtension;

    for (var i = 0; i < mappings.iconDefinitions.length; i++) {
        var def = mappings.iconDefinitions[i];
        var iconName = def.iconPath;
        var iconNameDark = def.iconPath.replace(iconExtension, darkPostfix + iconExtension);

        defs[iconName] = {
            "iconPath": relPath + iconName
        }

        defs[iconNameDark] = {
            "iconPath": relPath + iconNameDark
        }
    }

    return defs;
}

function createDarkThemeObj() {
    var iconExtension = mappings.settings.iconFileExtension;
    var darkPostfix = mappings.settings.darkTheme.postfix;
    var theme = {
        folder: mappings.settings.darkTheme.folder,
        folderExpanded: mappings.settings.darkTheme.folderExpanded,
        file: mappings.settings.darkTheme.file,
        fileExtensions: {},
        fileNames: {},
        folderNames: {},
        languageIds: {}
    };

    for (var i = 0; i < mappings.iconDefinitions.length; i++) {
        var icon = mappings.iconDefinitions[i];

        if (icon.fileExtensions != void 0) {
            for (var j = 0; j < icon.fileExtensions.length; j++) {
                var extension = icon.fileExtensions[j];

                theme.fileExtensions[extension] = icon.iconPath.replace(iconExtension, darkPostfix + iconExtension);
            }
        }

        if (icon.fileNames != void 0) {
            for (var k = 0; k < icon.fileNames.length; k++) {
                var fileName = icon.fileNames[k];
                theme.fileNames[fileName] = icon.iconPath;
            }
        }
    }

    return theme;
}

function createLightThemeObj() {
    var theme = {
        folder: mappings.settings.lightTheme.folder,
        folderExpanded: mappings.settings.lightTheme.folderExpanded,
        file: mappings.settings.lightTheme.file,
        fileExtensions: {},
        fileNames: {},
        folderNames: {},
        languageIds: {}
    };

    for (var i = 0; i < mappings.iconDefinitions.length; i++) {
        var icon = mappings.iconDefinitions[i];

        if (icon.fileExtensions != void 0) {
            for (var j = 0; j < icon.fileExtensions.length; j++) {
                var extension = icon.fileExtensions[j];
                theme.fileExtensions[extension] = icon.iconPath;
            }
        }

        if (icon.fileNames != void 0) {
            for (var k = 0; k < icon.fileNames.length; k++) {
                var fileName = icon.fileNames[k];
                theme.fileNames[fileName] = icon.iconPath;
            }
        }
    }

    return theme;
}

function createTestFiles() {
    var extensionsPath = './test/extensions/';
    var fileNamesPath = './test/filenames/';
    var folderNamesPath = './test/foldernames/';
    var languageIdsPath = './test/languageids/';

    if (!fs.existsSync(extensionsPath)) {
        fs.mkdirSync(extensionsPath);
    }

    if (!fs.existsSync(fileNamesPath)) {
        fs.mkdirSync(fileNamesPath);
    }

    if (!fs.existsSync(folderNamesPath)) {
        fs.mkdirSync(folderNamesPath);
    }

    if (!fs.existsSync(languageIdsPath)) {
        fs.mkdirSync(languageIdsPath);
    }

    for (var i = 0; i < mappings.iconDefinitions.length; i++) {
        var icon = mappings.iconDefinitions[i];

        // extensions
        if (icon.fileExtensions != void 0) {
            for (var j = 0; j < icon.fileExtensions.length; j++) {
                var extension = icon.fileExtensions[j];

                fs.writeFile(extensionsPath + extension + '.' + extension, "", function (err) {
                    if (err) return console.log(err);
                });
            }
        }

        // fileNames
        if (icon.fileNames != void 0) {
            for (var j = 0; j < icon.fileNames.length; j++) {
                var fileName = icon.fileNames[j];

                fs.writeFile(fileNamesPath + fileName, "", function (err) {
                    if (err) return console.log(err);
                });
            }
        }

        // folderNames
        if (icon.folderNames != void 0) {
            for (var j = 0; j < icon.folderNames.length; j++) {
                var folderName = icon.folderNames[j];

                fs.writeFile(folderNamesPath + folderName, "", function (err) {
                    if (err) return console.log(err);
                });
            }
        }

        // languageIds
        if (icon.languageIds != void 0) {
            for (var j = 0; j < icon.languageIds.length; j++) {
                var languageId = icon.languageIds[j];

                fs.writeFile(languageIdsPath + languageId, "", function (err) {
                    if (err) return console.log(err);
                });
            }
        }
    }
}