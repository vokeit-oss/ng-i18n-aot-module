export default {
    external:   [
        '@angular/core',
        'rxjs/BehaviorSubject',
        'rxjs/Observable'
    ],
    globals:    {
        '@angular/core':        'ng.core',
        'rxjs/BehaviorSubject': 'BehaviorSubject',
        'rxjs/Observable':      'Observable'
    },
    input:      './dist/locale-service/index.js',
    name:       'ngI18nAotModule',
    output:     {
        file:   './dist/ng-i18n-aot-module.umd.js',
        format: 'umd'
    },
    sourceMap:  false
}