"use strict";

module.exports = (md, options) => {

    const renderFunction = body => {
        let value = undefined;
        try {
            const f = Function("", body);
            value = f();
        } catch (ex) {
            return(`<p style="color:red">${ex.toString()}</p>`);
        }
        return(`<p>Result: ${value}</p>`);
    }; //

    const renderDefault = (tokens, index, options, object, renderer, previousHandler, defaultHtml) => {
        if (previousHandler)
            return(previousHandler(tokens, index, options, object, renderer))
        else
            return defaultHtml;
    }; //renderDefault

    const previousRender = md.renderer.rules.fence;
    md.renderer.rules.fence = (tokens, index, ruleOptions, object, renderer) => {
        if (tokens[index].info.trim() == "@calculate")
            return `${renderFunction(tokens[index].content)}`;
        else
            return renderDefault(tokens, index, ruleOptions, object, renderer, previousRender);
    }; //md.renderer.paragraph_open

}; //module.exports
