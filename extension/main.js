"use strict";

exports.activate = context => {

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
    const decoratorType = vscode.window.createTextEditorDecorationType({
        backgroundColor: "yellow"
    });

    const getAllMatches = (document, text) => {
        const length = lazy.settings.calculateIndicator.length;
        const prefix = "^\\`\\`\\`[\\s]*";
        const regex = new RegExp(`${prefix}(${lazy.settings.calculateIndicator})`, "mgi");
        const list = [];
        let result;
        while (result = regex.exec(text))
            list.push(getVSCodeRange(document, result.index + result[0].length - result[1].length, length));
        return list;
    }; //getAllMatches

    const updateDecorators = () => {
        if (!lazy.settings)
            lazy.settings = getSettings();
        const document = vscode.window.activeTextEditor.document;
        const text = vscode.window.activeTextEditor.document.getText();
        vscode.window.activeTextEditor.setDecorations(decoratorType, getAllMatches(document, text));
    }; //updateDecorators
    updateDecorators();

    vscode.workspace.onDidOpenTextDocument(textDocument => {
        if (textDocument.languageId == markdownId)
            updateDecorators();
    });
    vscode.window.onDidChangeActiveTextEditor(e=> {
        if (e.document && e.document.languageId == markdownId)
            updateDecorators();
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(e => {
        if (e.document && e.document.languageId == markdownId)
            updateDecorators();
    }); //vscode.workspace.onDidChangeTextDocument
    vscode.workspace.onDidChangeConfiguration(e => {
        lazy.settings = getSettings();
        updateDecorators(); // it checks up active text editor and its document anyway
    }); //vscode.workspace.onDidChangeConfiguration

    return {
        extendMarkdownIt: baseImplementation => {
            try {
                if (!lazy.settings)
                    lazy.settings = getSettings();
                const md = baseImplementation;
                md.use(calculator, lazy.settings);
                return md;
            } catch (ex) {
                activationExceptionHandler(ex);
            } //exception
        }
    };

}; //exports.activate

exports.deactivate = () => { };
