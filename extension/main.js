"use strict";

exports.activate = context => {

    const inlineKeyword = "return";
    
    const debugActivationException = false;
    const extensionManifestFileName = "package.json";
    const markdownId = "markdown";

    const lazy = { lastErrorChannel: null, settings: undefined };
    
    const vscode = require("vscode");
    const path = require("path");
    const fs = require("fs");

    const calculator = require("./calculator");

    const getSettings = () => {
        const configuration = vscode.workspace.getConfiguration();
        return configuration.markdown.calculator;
    }; //getSettings

    const activationExceptionHandler = ex => {
        const getManifest = () => {
            const pathName = path.join(context.extensionPath, extensionManifestFileName);
            const content = fs.readFileSync(pathName).toString();
            return JSON.parse(content);
        } //getManifest
        vscode.window.showErrorMessage(`${getManifest().displayName}: activation failed: ${ex.message}`);
        if (lazy.lastErrorChannel)
            lazy.lastErrorChannel.clear();
        else
            lazy.lastErrorChannel = vscode.window.createOutputChannel("Markdown Error");
        lazy.lastErrorChannel.show(true);
        lazy.lastErrorChannel.appendLine(ex.toString());
        if (!debugActivationException) return;
        lazy.lastErrorChannel.appendLine("Stack:");
        lazy.lastErrorChannel.appendLine(ex.stack);
    }; //activationExceptionHandler

    const getVSCodeRange = (document, start, length) => {
        return new vscode.Range(
            document.positionAt(start),
            document.positionAt(start + length));
    }; //getVSCodeRange

    const getAllMatches = (document, text, isBlock) => {
        const length = isBlock ? lazy.settings.executionIndicator.length : inlineKeyword.length;
        const prefix = isBlock ? "^(`{3,}|~{3,})[\\s]*" : "(`[\\s]*)";
        const indicator = isBlock ? lazy.settings.executionIndicator : inlineKeyword;
        const regex = new RegExp(`${prefix}(${indicator})`, "mgi"); 
        const list = [];
        let result;
        while (result = regex.exec(text))
            list.push({
                range: getVSCodeRange(document, result.index + result[0].length - result[2].length, length),
                hoverMessage: lazy.settings.keywordDecorator.hoverText,
            });
        return list;
    }; //getAllMatches

    const updateDecorators = () => {
        if (!lazy.settings)
            lazy.settings = getSettings();
        if (lazy.decoratorType)
            lazy.decoratorType.dispose();
        if (!lazy.settings.enable)
            return;
        if (!(lazy.settings.fencedCodeBlock.enable || lazy.settings.inlineCode.enable))
            return;
        let matches = [];
        const document = vscode.window.activeTextEditor.document;
        const text = vscode.window.activeTextEditor.document.getText();
        if (lazy.settings.fencedCodeBlock.enable) {
            const blockMatches = getAllMatches(document, text, true);
            matches = matches.concat(blockMatches);
        } //if
        if (lazy.settings.inlineCode.enable) {
            const inlineMatches = getAllMatches(document, text, false);
            matches = matches.concat(inlineMatches);
        } //if
        lazy.decoratorType = vscode.window.createTextEditorDecorationType({ backgroundColor: lazy.settings.keywordDecorator.color });
        vscode.window.activeTextEditor.setDecorations(lazy.decoratorType, matches);
    }; //updateDecorators
    updateDecorators();

    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(textDocument => {
        if (textDocument.languageId == markdownId)
            updateDecorators();
    }));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(e=> {
        if (e.document && e.document.languageId == markdownId)
            updateDecorators();
    }, null, context.subscriptions));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => {
        if (e.document && e.document.languageId == markdownId)
            updateDecorators();
    })); //vscode.workspace.onDidChangeTextDocument
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(_ => {
        lazy.settings = getSettings();
        updateDecorators()
    })); //vscode.workspace.onDidChangeConfiguration

    return {
        extendMarkdownIt: baseImplementation => {
            try {
                if (!lazy.settings)
                    lazy.settings = getSettings();
                const md = baseImplementation;
                md.use(calculator, lazy.settings, inlineKeyword);
                return md;
            } catch (ex) {
                activationExceptionHandler(ex);
            } //exception
        }
    };

}; //exports.activate

exports.deactivate = () => { };
