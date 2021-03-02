# Visual Studio Code extension: Markdown Calculator

Put the keyword (by default, "run") on the same line as the opening fence indicator.
It will force the fenced code to execute instead of rendering it:

````
~~~~ run
    const x = 2, y = 3;
    console.log(x, y, x+y);
    return x * y;
~~~~
````

The execution result will be rendered instead of the source code. The `console` functions are supported. The keyword, syntactic decorators, and output styles are configurable.

This extension can be combined with other markdown-it extensions. In particular, the rendered HTML can be saved using [Extensible Markdown](https://github.com/SAKryukov/vscode-extensible-markdown).

