/**
 * MIT License
 * 
 * Copyright (c) 2017 - 2018 actra.development, Korntal-Muenchingen
 * Parts of the code: Copyright (c) 2014-2017 Google, Inc. http://angular.io
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 * Basic libs
 */
import { Optional } from '@angular/core';
import {
	BehaviorSubject,
	Observable
} from 'rxjs';


const DefaultLocaleIdentifier: string = '_____default-$$$-locale_____';


export class NgI18nAotService {
    protected localeMap: {[key: string]: string}                                             = {};
    protected locale: string                                                                 = DefaultLocaleIdentifier;
    protected locale$: BehaviorSubject<string>                                               = new BehaviorSubject<string>(DefaultLocaleIdentifier);
    protected forceLocaleExists: boolean                                                     = false;
    protected translationIdMap: {[key: string]: {[key: string]: (display: boolean) => void}} = {};
    
    
    constructor(@Optional() locales: {[key: string]: string} = {}, @Optional() forceLocaleExists: boolean = false) {
        this.registerLocales(locales);
        this.setForceLocaleExists(forceLocaleExists);
    }
    
    
    /**
     * Set the flag to force locale existance on the locale map when trying to set the current locale
     */
    public setForceLocaleExists(forceLocaleExists: boolean = false) {
        this.forceLocaleExists = forceLocaleExists;
    }
    
    
    /**
     * Get the flag to force locale existance on the locale map when trying to set the current locale
     */
    public getForceLocaleExists(): boolean {
        return this.forceLocaleExists;
    }
    
    
    /**
     * Register multiple locales on the locale map
     */
    public registerLocales(locales: {[key: string]: string}): void {
        for(let code in locales) {
            if(!locales.hasOwnProperty(code)) {
                continue;
            }
            
            this.registerLocale(code, locales[code]);
        }
    }
    
    
    /**
     * Register a locale on the locale map
     */
    public registerLocale(code: string, name: string): void {
        this.localeMap[code] = name;
    }
    
    
    /**
     * Check if a locale exists on the map
     */
    public hasLocale(code: string): boolean {
        return !!(this.localeMap.hasOwnProperty(code) && 'string' === typeof this.localeMap[code]);
    }
    
    
    /**
     * Get the locale name for a locale code
     */
    public getLocaleName(code: string): string | null {
        return this.hasLocale(code) ? this.localeMap[code] : null;
    }
    
    
    /**
     * Get all registered locales
     */
    public getLocales(): {[key: string]: string} {
        return this.localeMap;
    }
    
    
    /**
     * Unregister a locale
     */
    public unregisterLocale(code: string): void {
        delete this.localeMap[code];
    }
    
    
    /**
     * Clear all locales
     */
    public clearLocales(): void {
        this.localeMap = {};
    }
    
    
    /**
     * Set a locale, automatically renders all translatable containers
     */
    public setLocale(locale: string | null = null): void {
        if('string' === typeof locale && this.getForceLocaleExists() && !this.hasLocale(<string>locale)) {
            return;
        }
        
        this.locale = locale || DefaultLocaleIdentifier;
        
        this.locale$.next(this.locale);
        this.renderAll(<string>locale);
    }
    
    
    /**
     * Get the currently set locale
     */
    public getLocale(): string {
        return this.locale;
    }
    
    
    /**
     * Get the locale stream
     */
    public getLocaleStream(): Observable<string> {
        return this.locale$.asObservable();
    }
    
    
    /**
     * Check if the (current) locale is the default locale
     */
    public isDefaultLocale(locale?: string): boolean {
        return DefaultLocaleIdentifier === (locale ? locale : this.getLocale());
    }
    
    
    /**
     * Subscribe to changes, renderer callback is executed on every change with a flag indicating if new locale matches the one the renderer is subscribed for
     */
    public subscribe(id: string, locale: string, isDefault: boolean, renderer: (display: boolean) => void): () => void {
        if(!(id in this.translationIdMap)) {
            this.translationIdMap[id] = <{[key: string]: (display: boolean) => void}>{};
        }

        this.translationIdMap[id][isDefault ? DefaultLocaleIdentifier : locale] = renderer;

        this.renderPartial(id, isDefault ? DefaultLocaleIdentifier : locale, this.getLocale());
        
        return () => { delete this.translationIdMap[id][isDefault ? DefaultLocaleIdentifier : locale]; };
    }
    
    
    /**
     * Render all translatable containers, used after changing the locale
     */
    protected renderAll(locale: string): void {
        Object.keys(this.translationIdMap).forEach((id: string) => {
            this.render(id, locale);
        });
    }
    
    
    /**
     * Render a single translatable container identified by id
     */
    protected render(id: string, locale: string): void {
        let setLocale: string = Object.keys(this.translationIdMap[id]).filter((checkLocale: string) => !!(checkLocale === locale)).length ? locale : DefaultLocaleIdentifier;
        
        Object.keys(this.translationIdMap[id]).every((checkLocale: string): boolean => {
            this.translationIdMap[id][checkLocale]((setLocale === checkLocale));
            
            return true;
        });
    }


    /**
     * Render one locale of a single translatable container
     */
    protected renderPartial(id: string, targetLocale: string, currentLocale: string): void {
        let renderer: (display: boolean) => void = this.translationIdMap[id][targetLocale];
        let setLocale: string                    = Object.keys(this.translationIdMap[id])
			.filter((checkLocale: string) => !!(checkLocale === currentLocale))
			.length ? currentLocale : DefaultLocaleIdentifier;

        if(renderer) {
            renderer((setLocale === targetLocale));
        }
    }
}