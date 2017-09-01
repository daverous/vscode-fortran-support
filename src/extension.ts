// src/extension.ts
import * as vscode from 'vscode';

import FortranLintingProvider from './features/linter-provider';
import FortranHoverProvider from './features/hover-provider';
import AlphaFortranFormatter from './features/document-format-provider'
import { FortranCompletionProvider } from './features/completion-provider';
import { FortranDocumentSymbolProvider } from './features/document-symbol-provider';
import {CMakeRunner} from './features/cmake';
export function activate(context: vscode.ExtensionContext) {


    

    let hoverProvider = new FortranHoverProvider();
    let completionProvider = new FortranCompletionProvider();
    let symbolProvider = new FortranDocumentSymbolProvider();
    let formatProvider = new AlphaFortranFormatter();
    let cmake = new CMakeRunner();
    vscode.commands.registerCommand('alphagenes.runcmake', cmake.run);
    if (vscode.workspace.getConfiguration('fortran').get('linterEnabled', true)) {

        let linter = new FortranLintingProvider();
        linter.activate(context.subscriptions);
        vscode.languages.registerCodeActionsProvider('fortran90', linter);
    }
    vscode.languages.registerCompletionItemProvider('fortran90', completionProvider);
    vscode.languages.registerHoverProvider('fortran90', hoverProvider);
    vscode.languages.registerDocumentSymbolProvider('fortran90', symbolProvider);
    vscode.languages.registerDocumentFormattingEditProvider('fortran90', formatProvider)
}