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


/**
 * Basic libs
 */
import {
    InjectionToken,
    ModuleWithProviders,
    NgModule
} from '@angular/core';


/**
 * Module components
 */
import { NgI18nAotDirective } from './ng-i18n-aot.directive';
import { NgI18nAotService } from './ng-i18n-aot.service';


export type NgI18nAotOptions                                         = {locales?: {[key: string]: string}, forceLocaleExists?: boolean};
export const NgI18nAotOptionsToken: InjectionToken<NgI18nAotOptions> = new InjectionToken<NgI18nAotOptions>('NgI18nAotOptions');


export function NgI18nAotServiceFactory(options: NgI18nAotOptions): NgI18nAotService {
    return new NgI18nAotService(options.hasOwnProperty('locales') ? options.locales : {}, options.hasOwnProperty('forceLocaleExists') ? options.forceLocaleExists : false);
}


@NgModule({
    declarations: [NgI18nAotDirective],
    exports:      [NgI18nAotDirective]
})
export class NgI18nAotModule {
    static forRoot(options?: {locales?: {[key: string]: string}, forceLocaleExists?: boolean}): ModuleWithProviders {
        return {
            ngModule:  NgI18nAotModule,
            providers: [
                {
                    provide:  NgI18nAotOptionsToken,
                    useValue: <NgI18nAotOptions>(options || {})
                },
                {
                    provide:    NgI18nAotService,
                    useFactory: NgI18nAotServiceFactory,
                    deps:       [NgI18nAotOptionsToken]
                }
            ]
        }
    }
}