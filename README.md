# Visual Studio Code extension: Markdown Calculator

Put the keyword (by default, "run") on the same line as the opening fence indicator.
It will force the *fenced code block* to execute instead of rendering it:

````
~~~~ run
    const x = 2, y = 3;
    console.log(x, y, x+y);
    return x * y;
~~~~
````

The execution results will be rendered instead of the source code:

2 3 5

6

Likewise, for an *inline code* fragment, the result of a calculation will be rendered, if it starts with the keyword "return". For example, `return 10 ** 6` will be rendered as 1000000.

The `console` functions are supported. The keyword, syntactic decorators, and output styles are configurable.

This extension can be combined with other markdown-it extensions. In particular, the rendered HTML can be saved using [Extensible Markdown](https://github.com/SAKryukov/vscode-extensible-markdown).

[Original publication](https://www.codeproject.com/Articles/5297157/Markdown-Calculator) will be accessible on April 1st, 2021.