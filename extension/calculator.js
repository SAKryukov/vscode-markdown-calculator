"use strict";

module.exports = (md, settings, inlineKeyword) => {

    const setReadonly = target => {
        const readonlyHandler = { set(obj, prop, value) { return false; } };
        return new Proxy(target, readonlyHandler);
    }; //setReadonly    

    const consoleApi = {
        lines: [],
        initialize: function() {
            const handleArguments = (elements, cssClass) => {
                this.lines.push({elements: elements, cssClass: cssClass});
            }; //
            const console = {
                assert: (assertion, ...args) => {
                    if (!assertion)
                        handleArguments(args, settings.cssClass.console.assert);
                },
                debug: (...args) => { handleArguments(args, settings.cssClass.console.debug); },
                dir: (...args) => { handleArguments(args, settings.cssClass.console.dir); },
                error: (...args) => { handleArguments(args, settings.cssClass.console.error); },
                info: (...args) => { handleArguments(args, settings.cssClass.console.info); },
                log: (...args) => { handleArguments(args, settings.cssClass.console.log); },
                warn: (...args) => { handleArguments(args, settings.cssClass.console.warn); },
            }; //console
            return setReadonly(console);
        },
        render: function() {
            let result = "";
            if (this.lines.length < 1) return result;
            for (let line of this.lines) {
                let renderedLine = "";
                for (let element of line.elements)
                    renderedLine += `${element} `;
                renderedLine = renderedLine.trim();
                result += `<p class="${line.cssClass}">${renderedLine}</p>`;
            }; //loop
            return result;
        },
        clear: function() {
            this.lines.splice(0);
        },
    }; //consoleApi
    const console = consoleApi.initialize();

    const safeFunctionBody = (body, inline) => {
        const safeGlobals =
            "const document = null," +
            "window = null, navigator = null," +
            "globalThis = {console: console};";
        return `${safeGlobals}\n${body}`;
    }; //safeFunctionBody

    const renderFunction = (body, inline) => {
        let value = undefined;
        try {
            const safeBody = safeFunctionBody(body, inline);
            const f = Function("console", safeBody);
            value = f(console);
            const consoleResults = consoleApi.render();
            if (value == undefined) value = "";
            const result = inline ?
                `${consoleResults}${value}`
                :
                `${consoleResults}<p class="${settings.cssClass.return}">${value}</p>`
            return(result);
        } catch (ex) {
            return(`<p class="${settings.cssClass.exception}">${ex.toString()}</p>`);
        } finally {
            consoleApi.clear();
        } //exception
    }; //renderFunction

    const renderDefault = (tokens, index, options, object, renderer, previousHandler) => {
        if (previousHandler)
            return(previousHandler(tokens, index, options, object, renderer))
    }; //renderDefault

    const previousFenceRenderer = md.renderer.rules.fence;
    md.renderer.rules.fence = (tokens, index, ruleOptions, object, renderer) => {
        if (settings.enable && settings.fencedCodeBlock.enable && tokens[index].info.trim() == settings.executionIndicator)
            return `${renderFunction(tokens[index].content)}`;
        else
            return renderDefault(tokens, index, ruleOptions, object, renderer, previousFenceRenderer);
    }; //md.renderer.rules.fence

    const previousInlineCodeRenderer = md.renderer.rules.code_inline;
    md.renderer.rules.code_inline = (tokens, index, ruleOptions, object, renderer) => {
        let expressionString = tokens[index].content.trim();
        if (settings.enable && settings.inlineCode.enable && expressionString.startsWith(`${inlineKeyword} `))
            return `${renderFunction(expressionString, true)}`;
        else
            return renderDefault(tokens, index, ruleOptions, object, renderer, previousInlineCodeRenderer);
    }; //md.renderer.rules.code_inline

}; //module.exports
