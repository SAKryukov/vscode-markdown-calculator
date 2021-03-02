"use strict";

const debugActivationException = false;
const customContextConditionName = "MarkdownReady";
const setContextCommand = "setContext"; // not documented in VSCode API documentation

exports.activate = context => {

    const lazy = { lastErrorChannel: null, settings: undefined };

    
    const vscode = require("vscode");
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
        vscode.window.showErrorMessage(`${getManifest().displayName}: activation failed`);
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

    const updateDecorators = () => {
        //SA???
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
                vscode.commands.executeCommand(setContextCommand, customContextConditionName, true);
                return md;
            } catch (ex) { activationExceptionHandler(ex); }
        }
    };

}; //exports.activate

exports.deactivate = () => { };
