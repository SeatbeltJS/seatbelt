Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("../../");
const fs_1 = require("fs");
const path_1 = require("path");
const scanFolder = require('scan-folder');
class TSImportCreator {
    constructor(path) {
        this.log = new _1.Log('Seatbelt-TSImportCreator');
        this.appPath = path;
    }
    init() {
        this.log.system('creating ts importer');
        const files = scanFolder(this.appPath, 'ts', true).filter((path) => path.indexOf('/.seatbelt/') === -1);
        this.log.system('files found', files);
        this._createPath();
        this._createImportsTS(files);
        this._createServerTS(files);
    }
    _createRollupConfig() {
        const rollupConfigPath = path_1.join(this.seatbeltPath, 'rollupconfig.js');
        const rollupTemplate = fs_1.readFileSync(path_1.join(__dirname, 'rollup.js.template'));
        this.log.system('writing rollup config at path ', rollupConfigPath, rollupTemplate.length);
        fs_1.writeFileSync(rollupConfigPath, rollupTemplate);
    }
    _createPath() {
        this.seatbeltPath = path_1.join(this.appPath, '.seatbelt');
        if (!fs_1.existsSync(this.seatbeltPath)) {
            fs_1.mkdirSync(this.seatbeltPath);
        }
    }
    _createImportsTS(files) {
        this.seatbeltPath = path_1.join(this.appPath, '.seatbelt');
        let importsTemplate = '';
        let importsTemplateBottom = '\nexport const allImports = {';
        files.forEach((file, i) => {
            file = file.slice(0, -3);
            importsTemplate += `import * as File${i} from '${file}';\n`;
            importsTemplateBottom += `\n  File${i}`;
            if (files[i + 1]) {
                importsTemplateBottom += ',';
            }
        });
        importsTemplateBottom += '\n};';
        fs_1.writeFileSync(path_1.join(this.seatbeltPath, 'imports.ts'), importsTemplate + importsTemplateBottom);
    }
    _createServerTS(files) {
        this.writePath = path_1.join(this.seatbeltPath, 'index.ts');
        const template = fs_1.readFileSync(path_1.join(__dirname, 'boot.ts.template'));
        this.log.system('writing server template to path', this.writePath, '' + template.length);
        fs_1.writeFileSync(this.writePath, template);
        this._createRollupConfig();
    }
}
exports.TSImportCreator = TSImportCreator;
