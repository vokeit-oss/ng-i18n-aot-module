export default {
    external:   [
		'@angular/core',
		'rxjs'
    ],
    input:      './dist/locale-service/index.js',
    output:     {
		amd:       {id: 'ngI18nAotModule'},
        file:      './dist/ng-i18n-aot-module.umd.js',
        format:    'umd',
		globals:   {
			'@angular/core': 'ng.core'
		},
		name:      'ngI18nAotModule',
		sourceMap: false
    }
}