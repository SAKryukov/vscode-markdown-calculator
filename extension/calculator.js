"use strict";

module.exports = (md, options) => {

    const functionMap = new Map();
    const functionRegexp = new RegExp(/\@calculate\{(.*)\}/, "sgm");

    const renderFunction = body => {
        return("<p>calc result");
    }; //

    md.core.ruler.after("block", "collectFunctions", state => {
        for (let index = 0; index < state.tokens.length; ++index) {
            const token = state.tokens[index];
            const isParagraph = token.type == "paragraph_open";
            if (!isParagraph) continue;
            const contentToken = state.tokens[index + 1];
            if (!contentToken) continue;
            const match = functionRegexp.exec(contentToken.content);
            if (match) {
                const body = match[1];
                if (body) functionMap.set(index, body);
            } //if
        } //loop tokens
    }); //md.core.ruler.after

    const renderDefault = (tokens, index, options, object, renderer, previousHandler, defaultHtml) => {
        if (previousHandler)
            return(previousHandler(tokens, index, options, object, renderer))
        else
            return defaultHtml;
    }; //renderDefault

    let ignoringText = false;

    const previousRenderParagraphOpen = md.renderer.rules.paragraph_open;
    md.renderer.rules.paragraph_open = (tokens, index, ruleOptions, object, renderer) => {
        const body = functionMap.get(index);
        if (!body)
            return renderDefault(tokens, index, ruleOptions, object, renderer, previousRenderParagraphOpen, `<p>`);
        ignoringText = true;
        return renderFunction(body);
    }; //md.renderer.paragraph_open

    const previousRenderParagraphClose = md.renderer.rules.paragraph_close;
    md.renderer.rules.paragraph_close = (tokens, index, ruleOptions, object, renderer) => {
        ignoringText = false;
        return renderDefault(tokens, index, ruleOptions, object, renderer, previousRenderParagraphClose);
    }; //md.renderer.paragraph_open


    const previousRender = md.renderer.rules.text;
    md.renderer.rules.text = (tokens, index, ruleOptions, object, renderer) => {
        if (ignoringText)
            return "";
        return renderDefault(tokens, index, ruleOptions, object, renderer, previousRender);
    }; //md.renderer.paragraph_open


}; //module.exports
