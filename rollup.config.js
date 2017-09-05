export default {
    entry:      './dist/locale-service/index.js',
    dest:       './dist/ng-i18n-aot-module.umd.js',
    sourceMap:  false,
    format:     'umd',
    moduleName: 'ngI18nAotModule',
    external:   [
        '@angular/core',
        'rxjs/BehaviorSubject',
        'rxjs/Observable'
    ],
    globals:    {
        '@angular/core':        'ng.core',
        'rxjs/BehaviorSubject': 'BehaviorSubject',
        'rxjs/Observable':      'Observable'
    }
}