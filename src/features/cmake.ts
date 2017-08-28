import * as vscode from 'vscode';
import * as os from "os";
import * as fs from "fs";

const TmpDir = os.tmpdir();


export class CMakeRunner {
      private _outputChannel: vscode.OutputChannel;
      private _terminal: vscode.Terminal;
      private _isRunning: boolean;
      private _process;
      private _codeFile: string;
      private _isTmpFile: boolean;
      private _languageId: string;
      private _cwd: string;
      private _config: vscode.WorkspaceConfiguration;
    constructor() {
        this._outputChannel = vscode.window.createOutputChannel("Code");
        this._terminal = null;
    }


public run(this, args): void {
    if (this._isRunning) {
        vscode.window.showWarningMessage("Code is already being built");
        return;
    }

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage("No code found or selected.");
        return;
    }

    this.initialize(editor);

    const fileExtension = this.getFileExtension(editor);
    this.executeCmake();
}


private initialize(editor: vscode.TextEditor): void {
    this._config = vscode.workspace.getConfiguration("code-runner");
    this._cwd = this._config.get<string>("cwd");
    if (this._cwd) {
        return;
    }
    if ((this._config.get<boolean>("fileDirectoryAsCwd") || !vscode.workspace.rootPath)
        && editor && !editor.document.isUntitled) {
        this._cwd = __dirname;
    } else {
        this._cwd = vscode.workspace.rootPath;
    }
    if (this._cwd) {
        return;
    }
    this._cwd = TmpDir;
}

private getFileExtension(editor: vscode.TextEditor): string {
    const fileName = editor.document.fileName;
    const index = fileName.lastIndexOf(".");
    if (index !== -1) {
        return fileName.substr(index);
    } else {
        return "";
    }
}



private executeCmake() {
    this._isRunning = true;
    const clearPreviousOutput = this._config.get<boolean>("clearPreviousOutput");
    if (clearPreviousOutput) {
        this._outputChannel.clear();
    }
    const showExecutionMessage = this._config.get<boolean>("showExecutionMessage");
    this._outputChannel.show(this._config.get<boolean>("preserveFocus"));
    const exec = require("child_process").exec;
    const command = "cmake -DCMAKE_BUILD_TYPE=DEBUG .";
    if (showExecutionMessage) {
        this._outputChannel.appendLine("[Running] " + command);
    }
    const startTime = new Date();
    this._process = exec(command, { cwd: this._cwd });

    this._process.stdout.on("data", (data) => {
        this._outputChannel.append(data);
    });

    this._process.stderr.on("data", (data) => {
        this._outputChannel.append(data);
    });

    this._process.on("close", (code) => {
        this._isRunning = false;
        const endTime = new Date();
        const elapsedTime = (endTime.getTime() - startTime.getTime()) / 1000;
        this._outputChannel.appendLine("");
        if (showExecutionMessage) {
            this._outputChannel.appendLine("[Done] exited with code=" + code + " in " + elapsedTime + " seconds");
            this._outputChannel.appendLine("");
        }
        if (this._isTmpFile) {
            fs.unlink(this._codeFile);
        }
    });
}

}