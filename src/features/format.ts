import * as vscode from 'vscode';
import { parseSubroutineAndFunctions } from '../lib/functions';

// export class AlphaFortranFormatter implements vscode.DocumentFormattingEditProvider {

//     protected static spacePlaceholderStr = '__VSCODE__SPACE__PLACEHOLDER__';
//     protected static depth: number = 0;
//     protected static options: vscode.FormattingOptions;
//     protected static source: string;
//     protected static langId: string;
//     protected static offset: number = 0;
//     protected static prev: string = '';
//     protected static next: string = '';
//     protected static space;
//     protected static newLine;
//     protected static char;
//     protected static last;
//     protected static words: string[];

   
//         public formatDocument(document: vscode.TextDocument):
//             Thenable<vscode.TextEdit[]> {
//                 let lines = document.lineCount;
//                 let funcs = [];
//                 let curSubName = "";
//                 let curDepth = "";
//                 let ifRegexe = /^((if|else\s*if)(\s*\(.+\))\s*then)/ig;
//                 let blockReger = /^(block)/ig;
//                 for (let i = 0; i < lines; i++) {
//                     let line: vscode.TextLine = document.lineAt(i);
//                     if (line.isEmptyOrWhitespace) continue;
//                     if (line[line.firstNonWhitespaceCharacterIndex] = '#') {
//                         // TODO set depth to be 0, as this has to be preprocessored
//                     }
//                     let subFuct = parseSubroutineAndFunctions(line.text,curSubName )
//                 }

//         }
//     }
    