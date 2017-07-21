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
    AfterViewInit,
    ChangeDetectorRef,
    Directive,
    Input,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';


/**
 * Module components
 */
import { NgI18nAotService } from './ng-i18n-aot.service';


@Directive({
    selector: '[ngI18nAot]'
})
export class NgI18nAotDirective implements AfterViewInit {
    protected ngI18nAotService: NgI18nAotService;
    protected templateReference: TemplateRef<any>;
    protected viewContainerReference: ViewContainerRef;
    protected changeDetectorRefeference: ChangeDetectorRef;
    protected id: string;
    protected locale: string;
    protected isDefault: boolean = false;
    
    
    constructor(ngI18nAotService: NgI18nAotService, templateReference: TemplateRef<any>, viewContainerReference: ViewContainerRef, changeDetectorRefeference: ChangeDetectorRef) {
        this.ngI18nAotService          = ngI18nAotService;
        this.templateReference         = templateReference;
        this.viewContainerReference    = viewContainerReference;
        this.changeDetectorRefeference = changeDetectorRefeference;
        
        // Hide until the view is initialized
        this.viewContainerReference.clear();
    }
    
    
    public ngAfterViewInit(): void {
        this.ngI18nAotService.subscribe(this.id, this.locale, this.isDefault, (display: boolean) => {
            display ? this.viewContainerReference.createEmbeddedView(this.templateReference) : this.viewContainerReference.clear();
            
            // Force change detection as with the newly created view changes for e.g. *ngIf might not be detected
            this.changeDetectorRefeference.detectChanges();
        });
    }
    
    
    @Input() set ngI18nAot(id: string) {
        this.id = id;
    }
    
    
    @Input() set ngI18nAotLocale(locale: string) {
        this.locale = locale;
    }
    
    
    @Input() set ngI18nAotIsDefault(isDefault: boolean) {
        this.isDefault = isDefault;
    }
}