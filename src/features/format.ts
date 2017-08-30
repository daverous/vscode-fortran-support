// import * as vscode from 'vscode';
// import { parseSubroutineAndFunctions } from '../lib/functions';

// export class AlphaFortranFormatter implements vscode.DocumentFormattingEditProvider {
//     provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
//         throw new Error("Method not implemented.");
//     }

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
//                 let blocks:boolean[] = [];
//                 let curSubName = "";
//                 let curDepth:number = 0;

                
//                 for (let i = 0; i < lines; i++) {
//                     let line: vscode.TextLine = document.lineAt(i);
//                     if (line.isEmptyOrWhitespace) continue;
//                     if (line[line.firstNonWhitespaceCharacterIndex] = '#') {
//                         // TODO set depth to be 0, as this has to be preprocessored
//                     }
//                     if (line[line.firstNonWhitespaceCharacterIndex] = '!') {
//                         // TODO depth has to be the 
//                     }

//                     let subFuct = parseSubroutineAndFunctions(line.text,curSubName )
//                 }

//         }


        
    // }
    