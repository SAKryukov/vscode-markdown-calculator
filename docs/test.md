## Calculate, not Show

In-document calculations:

~~~~~~~~~~ run
   const x = 3;
   const y = 2; 
   console.log(x / y);
   console.log("Return value:");
   return x * y;
~~~~~~~~~~

## Inline Code

Inline code `2 * 2` is shown as it is, but `return 2*2` is rendered as 4.

### Calculate More

``` run
   console.log(Math.PI, Math.cos(Math.PI));
```