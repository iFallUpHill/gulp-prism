# gulp-prism

[![npm](https://img.shields.io/npm/v/gulp-prism.svg)]()
[![npm](https://img.shields.io/npm/l/gulp-prism.svg)]()

[Check it out on npm!](https://www.npmjs.com/package/gulp-prism "gulp-prism")

## About
Pipe code snippets through [Prism](http://prismjs.com/ "Prism") using `gulp` to pre-tag code blocks at compile time. This only applies to code blocks formatted properly using both the `pre` and `code` tags (i.e. `<pre><code>`) and that have a specified `{lang|language}-{LANG_NAME}` class on the `code` tag. See the usage section for more information. 

## Install

```bash
npm install gulp-prism --save-dev
```

## Usage

### gulpfile.js
```js
var gulp = require('gulp');
var highlight = require('gulp-prism');

gulp.task('default', function () {
	gulp.src('src/index.html')
		.pipe(highlight())
		.pipe(gulp.dest('dist'));
});
```

### src/index.html

#### Input 

```html
<pre><code class="language-html">&lt;div&gt;
	This will be highlighted!
&lt;div&gt;</code></pre>

```

#### Output
```html
<pre><code class="language-html prism"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>
    This will be highlighted!
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span></code></pre>
```

#### Notes

* You must specify the snippet language on the `<code>` tag or else the code block will not be highlighted.

* You must use escaped HTML within the `<pre><code>` block.

* Code blocks that have been highlighted using Prism will have the `prism` class added to them. Similarly, code blocks that were not highlighted will have the `no-prism` class added to them.

## Known Issues

* No CSS is included. This is intentional as this library is only intended to pre-wrap code snippets within code blocks using Prism's semantic tags. You are required to define and include your own CSS. An example SCSS file can be found [here](https://github.com/iFallUpHill/boba/blob/master/src/scss/docs/_prism.scss "example").

* Plugins are currently not supported. Feel free to submit a pull request to help get the ball moving!

