"use strict";

module.exports = (md, settings) => {

    const renderFunction = body => {
        let value = undefined;
        try {
            const f = Function("", body);
            value = f();
        } catch (ex) {
            return(`<p style="color:${settings.exceptionColor}">${ex.toString()}</p>`);
        }
        return(`<p>Result: ${value}</p>`);
    }; //

    const renderDefault = (tokens, index, options, object, renderer, previousHandler) => {
        if (previousHandler)
            return(previousHandler(tokens, index, options, object, renderer))
    }; //renderDefault

    const previousRender = md.renderer.rules.fence;
    md.renderer.rules.fence = (tokens, index, ruleOptions, object, renderer) => {
        if (settings.enable && tokens[index].info.trim() == settings.calculateIndicator)
            return `${renderFunction(tokens[index].content)}`;
        else
            return renderDefault(tokens, index, ruleOptions, object, renderer, previousRender);
    }; //md.renderer.rules.fence

}; //module.exports
