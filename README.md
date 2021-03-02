# Visual Studio Code extension: Markdown Calculator

Put the keyword (by default, "run") on the same line as the opening fence indicator.
It will force the code to execute instead of rendering it:

````
``` run
    const x = 2, y = 3;
    console.log(x, y, x+y);
    return x * y;
```
````

The execution result will be rendered instead of the source code. The `console` functions are supported.

