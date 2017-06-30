/**
 * MIT License
 * 
 * Copyright (c) 2017 actra.development, Korntal-Muenchingen
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


const DefaultLocaleIdentifier: string = '_____default-$$$-locale_____';


export class NgI18nAotService {
    protected map: {[key: string]: {[key: string]: (display: boolean) => void}} = {};
    protected locale: string = DefaultLocaleIdentifier;
    
    
    /**
     * Set a locale, automatically renders all translatable containers
     */
    public setLocale(locale: string): void {
        this.locale = locale;
        
        this.renderAll(locale);
    }
    
    
    /**
     * Get the currently set locale
     */
    public getLocale(): string {
        return this.locale;
    }
    
    
    /**
     * Subscribe to changes, renderer callback is executed on every change with a flag indicating if new locale matches the one the renderer is subscribed for
     */
    public subscribe(id: string, locale: string, isDefault: boolean, renderer: (display: boolean) => void): () => void {
        if(!(id in this.map)) {
            this.map[id] = <{[key: string]: (display: boolean) => void}>{};
        }
        
        this.map[id][isDefault ? DefaultLocaleIdentifier : locale] = renderer;
        
        this.render(id, this.getLocale());
        
        return () => { delete this.map[id][isDefault ? DefaultLocaleIdentifier : locale]; };
    }
    
    
    /**
     * Render all translatable containers, used after changing the locale
     */
    protected renderAll(locale: string): void {
        Object.keys(this.map).forEach((id: string) => {
            this.render(id, locale);
        });
    }
    
    
    /**
     * Render a single translatable container identified by id
     */
    protected render(id: string, locale: string): void {
        let setLocale: string = Object.keys(this.map[id]).filter((checkLocale: string) => !!(checkLocale === locale)).length ? locale : DefaultLocaleIdentifier;
        
        Object.keys(this.map[id]).every((checkLocale: string): boolean => {
            this.map[id][checkLocale]((setLocale === checkLocale));
            
            return true;
        });
    }
}