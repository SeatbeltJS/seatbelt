import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { Log } from '../log';
import { NewApp } from './new_app';
import { TSImportCreator } from './ts_import_creator';
import { Rollup } from './rollup';
import { BootApp } from './boot_app';

const CONFIG_FOLDER = '.seatbelt';
const CONFIG_JSON = 'seatbelt.json';

export interface ISeatbelt {
  strap(): void;
  getRoot(): string;
}

const caller = (): string => {
  return dirname(module.parent.parent.filename);
};

export class Seatbelt implements ISeatbelt {
  private log = new Log('Seatbelt');
  private _root: string = '';
  private _app: any;
  private _setRoot(root: string) {
    this._root = root;
  }
  public getRoot(): string {
    return this._root;
  }
  private _initConfig(cb: Function) {
    const configFolder = join(this.getRoot(), CONFIG_FOLDER);
    const configFolderExist = existsSync(configFolder);
    const configJson = join(configFolder, CONFIG_JSON);
    const configJsonExist = existsSync(join(this.getRoot(), CONFIG_FOLDER, CONFIG_JSON));
    if (!configFolderExist && !configJsonExist) {
      return new NewApp(join(this.getRoot(), CONFIG_FOLDER), CONFIG_JSON).init()
      .then(() => cb());
    }

    return cb();
  }
  private _bootApp() {
    return new BootApp(this.getRoot()).init();
  }
  private _createTSImporter() {
    return new TSImportCreator(this.getRoot()).init();
  }
  private _rollUpFiles(cb: Function) {
    return new Rollup(this.getRoot()).init(cb);
  }
  public strap() {
    this._setRoot(caller());
    this.log.system('▬▬▬▬(๑๑)▬▬▬▬ setbelt strapped to', this.getRoot());
    this._createTSImporter();
    this._rollUpFiles(() => {
      this._bootApp();
    })
    .catch((err: Error) => this.log.error(err));
  }
}
