import { Injectable, Injector } from '@angular/core';

import { StorageService } from '../storage/storage.service';
import { ConfigService } from '../config/config.service';
import { LangService } from '../lang/lang.service';
import { Loggly } from '../loggly/loggly.service';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {
  public storageSrv: StorageService;
  public configSrv: ConfigService;
  public langSrv: LangService;
  public logSrv: Loggly;

  constructor(public injector: Injector) {
    this.storageSrv = this.injector.get(StorageService);
    this.configSrv = this.injector.get(ConfigService);
    this.langSrv = this.injector.get(LangService);
    this.logSrv = this.injector.get(Loggly);
  }

  // Mandatory implementation
  abstract init(): void;

  public modelize(object, toDelete: any = [], dataIsArr: boolean = false) {
    const lang = this.langSrv.getCurrentLang();
    const defaultLang = this.langSrv.getDefaultLang();

    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        if (key.startsWith('_m_')) {
          const newKey = key.replace('_m_', '');

          object.__defineGetter__(newKey,
            () => object[key][lang] === null ? newKey : object[key][lang] || object[key][defaultLang]
          );
        } else if (typeof object[key] === 'object') {
          this.modelize(object[key]);
        } else if (Object.prototype.toString.call(object) === '[object Array]') {
          for (const item of object) {
            this.modelize(item);
          }
        }
      }
    }

    return object;
  }
}
