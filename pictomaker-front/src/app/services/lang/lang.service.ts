import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  private DEFAULT = 'en';
  private currentLang: string = null;
  private current = new Subject<string>();
  private detectedLang: string;
  private LANGS = {
    es: [{code: 'es', name: 'Español'}, {code: 'de', name: 'Alemán'}, {code: 'en', name: 'Inglés'}, {code: 'fr', name: 'Francés'}, {code: 'it', name: 'Italiano'}],
    de: [{code: 'es', name: 'Spanish'}, {code: 'de', name: 'Deutsch'}, {code: 'en', name: 'Englisch'}, {code: 'fr', name: 'Französisch'}, {code: 'it', name: 'Italienisch'}],
    en: [{code: 'es', name: 'Spanish'}, {code: 'de', name: 'German'}, {code: 'en', name: 'English'}, {code: 'fr', name: 'French'}, {code: 'it', name: 'Italian'}],
    fr: [{code: 'es', name: 'Espagnol'}, {code: 'de', name: 'Allemand'}, {code: 'en', name: 'Anglais'}, {code: 'fr', name: 'Français'}, {code: 'it', name: 'Italien'}],
    it: [{code: 'es', name: 'Spagnolo'}, {code: 'de', name: 'Tedesco'}, {code: 'en', name: 'Inglese'}, {code: 'fr', name: 'Francese'}, {code: 'it', name: 'Italiano'}]
  };

  constructor(private storageSrv: StorageService) { }

  public init() {
    this.setCurrentLang();
  }

  public getAvailableLang(lang: string) {
    if (lang) {
      return this.LANGS[lang];
    }

    return this.LANGS;
  }

  /**
   * Set language
   */
  public setCurrentLang(lang?) {
    if (!lang) {
      this.currentLang = this.getLangBrowser();
    } else {
      this.currentLang = lang;
    }

    this.storageSrv.set('lang', this.currentLang);
    this.current.next(this.currentLang);
  }

  /**
   * Default lang code
   */
  public getDefaultLang(): string {
    return this.DEFAULT;
  }

  /**
   * Default lang code
   */
  public getDetectedLang(): string {
    return this.detectedLang || null;
  }

  /**
   * Get current language
   */
  public getCurrentLang(): string {
    return this.currentLang || this.DEFAULT;
  }

  /**
   * Return counter language on Observable
   */
  public getCurrent(): Observable<string> {
    return this.current.asObservable();
  }

  /**
   * Get lang from browser if not return default one
   */
  public getLangBrowser() {
    if (window.Intl && typeof window.Intl === 'object') {
      const lang = navigator.language;
      const aux = lang.split('-')[0];

      this.detectedLang = aux;

      return aux;
    } else {
      return this.DEFAULT;
    }
  }

  /**
   * Get lang from user
   */
  public getUserLang(): string {
    return this.DEFAULT;
  }
}
