export default {
    entry:      './dist/locale-service/index.js',
    dest:       './dist/ng-i18n-aot-module.umd.js',
    sourceMap:  false,
    format:     'umd',
    moduleName: 'ngI18nAotModule',
    globals:    {
        '@angular/core': 'ng.core'
    }
}