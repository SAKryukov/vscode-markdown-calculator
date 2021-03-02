"use strict";

module.exports = (md, options) => {

    const functionMap = new Map();
    const functionRegexp = new RegExp(/\@\{(.*?)\}/, "gm");

    const test = functionRegexp.exec("@{a\naa}");

    md.core.ruler.after("block", "collectFunctions", state => {
        for (let index = 0; index < state.tokens.length; ++index) {
            const token = state.tokens[index];
            const isParagraph = token.type == "paragraph_open";
            if (!isParagraph) continue;
            const contentToken = state.tokens[index + 1];
            const match = functionRegexp.exec(contentToken.content);
            if (match) {
                const g = match[0];
            } //if
        } //loop tokens
    }); //md.core.ruler.after

    const previousRenderParagraphOpen = md.renderer.rules.paragraph_open;
    md.renderer.rules.paragraph_open = (tokens, index, ruleOptions, object, renderer) => {
        return utility.renderDefault(tokens, index, ruleOptions, object, renderer, previousRenderParagraphOpen, `<p>`);
    }; //md.renderer.paragraph_open

}; //module.exports
