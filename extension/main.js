"use strict";

const debugActivationException = false;
const customContextConditionName = "MarkdownReady";
const setContextCommand = "setContext"; // not documented in VSCode API documentation

exports.activate = context => {

    const lazy = { lastErrorChannel: null, settings: undefined };

    const calculator = require("./calculator");

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

    return {
        extendMarkdownIt: baseImplementation => {
            try {
                const md = baseImplementation;
                md.use(calculator, null);
                vscode.commands.executeCommand(setContextCommand, customContextConditionName, true);
                return md;
            } catch (ex) { activationExceptionHandler(ex); }
        }
    };

}; //exports.activate

exports.deactivate = () => { };
