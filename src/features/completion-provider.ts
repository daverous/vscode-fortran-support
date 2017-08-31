

import { CancellationToken, TextDocument, Position, Hover } from "vscode";
import * as fs from 'fs';
import * as vscode from 'vscode';
import { isPositionInString, intrinsics, FORTRAN_KEYWORDS } from "../lib/helper";
import { getDeclaredSubroutinesVariablesAndFunctions } from "../lib/functions";


export class FortranCompletionProvider implements vscode.CompletionItemProvider {

    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.CompletionItem[]> {
        return this.provideCompletionItemsInternal(document, position, token, vscode.workspace.getConfiguration('go'));
    }
    public provideCompletionItemsInternal(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, config: vscode.WorkspaceConfiguration): Thenable<vscode.CompletionItem[]> {
        return new Promise<vscode.CompletionItem[]>((resolve, reject) => {
            let filename = document.fileName;
            let lineText = document.lineAt(position.line).text;
            let lineTillCurrentPosition = lineText.substr(0, position.character);
            // nothing to complete
            if (lineText.match(/^\s*\/\//)) {
                return resolve([]);
            }

            let inString = isPositionInString(document, position);
            if (!inString && lineTillCurrentPosition.endsWith('\"')) { // completing a string
                return resolve([]);
            }

            // get current word
            let wordAtPosition = document.getWordRangeAtPosition(position);
            let currentWord = '';
            if (wordAtPosition && wordAtPosition.start.character < position.character) {
                let word = document.getText(wordAtPosition);
                currentWord = word.substr(0, position.character - wordAtPosition.start.character);
            }

            if (currentWord.match(/^\d+$/)) { // starts with a number
                return resolve([]);
            }

            let suggestions = new Set();

            if (currentWord.length > 0) {
                intrinsics.forEach(intrinsic => {
                    if (intrinsic.startsWith(currentWord.toUpperCase())) {
                        suggestions.add(new vscode.CompletionItem(intrinsic, vscode.CompletionItemKind.Method));
                    }
                });

                // add keyword suggestions
               FORTRAN_KEYWORDS.forEach(keyword => {
                    if (keyword.startsWith(currentWord.toUpperCase())) {
                        suggestions.add(new vscode.CompletionItem(keyword.toLowerCase(), vscode.CompletionItemKind.Keyword));
                    }
                });
            }


            let funcsSubsAndVars = getDeclaredSubroutinesVariablesAndFunctions(document);

            const subs = funcsSubsAndVars[0]
            // check for available functions
            subs.filter(sub => sub.name.toLowerCase().startsWith(currentWord.toLowerCase()))
            .forEach(sub =>{
                suggestions.add(new vscode.CompletionItem(sub.name, vscode.CompletionItemKind.Function));   
            });

            const functions = funcsSubsAndVars[1];
            // check for available functions
            functions.filter(fun => fun.name.toLowerCase().startsWith(currentWord.toLowerCase()))
            .forEach(fun =>{
                suggestions.add(new vscode.CompletionItem(fun.name, vscode.CompletionItemKind.Function));   
            });
            
            // get only unique variables
            // TODO this shouldn't need done 
            const vars = funcsSubsAndVars[2].filter(v => v.name.toLowerCase().startsWith(currentWord.toLowerCase())).map( a => a.name);
            // check for available functions
            vars.forEach(v =>{
                suggestions.add(new vscode.CompletionItem(v, vscode.CompletionItemKind.Function));   
            });
            

            return resolve([...suggestions]);

        })

    }
}
