import {
    TextDocument, DocumentFormattingEditProvider,
    DocumentRangeFormattingEditProvider,
    FormattingOptions, CancellationToken,
    TextEdit, ExtensionContext, TextEditor,
    commands, window, DocumentSelector,
    languages, Position, Range,TextLine
  } from 'vscode';
import { parseSubroutineAndFunctions, matchBlock,endTypeRegex,getRange, elseifRegex, elseRegex } from '../lib/functions';

export default class AlphaFortranFormatter implements DocumentFormattingEditProvider {


    protected static spacePlaceholderStr = '__VSCODE__SPACE__PLACEHOLDER__';
    protected static depth: number = 0;
    protected static source: string;
    protected static langId: string;
    protected static offset: number = 0;
    protected static prev: string = '';
    protected static next: string = '';
    protected static space;
    protected static newLine;
    protected static char;
    protected static last;
    protected static words: string[];

   
    public provideDocumentFormattingEdits(document: TextDocument, options: FormattingOptions, token: CancellationToken): TextEdit[] | Thenable<TextEdit[]> {
        let originText: string = document.getText();
    
        var range = getRange(document);
        let textEdits: TextEdit[] = [];

        let formattedText: string = this.formatDocument(document)
        let reformated = TextEdit.replace(range, formattedText);
        textEdits.push(reformated);
        return textEdits;
      }

        public formatDocument(document: TextDocument):
            string {
                let lines = document.lineCount;
                let blocks:boolean[] = [];
                let curSubName = "";
                let curDepth:number = 0;
                let formattedText: string = "";
                
                for (let i = 0; i < lines; i++) {
                    let line: TextLine = document.lineAt(i);
                    let lineText = line.text;
                    lineText = lineText.trim();
                    if (line.isEmptyOrWhitespace) formattedText += '\n';
                    else if (lineText.charAt(0) == '#') {
                        formattedText += lineText + '\n';
                    
                    }
                    // if (line[line.firstNonWhitespaceCharacterIndex] == '!') {
                    //     // TODO depth has to be the smae
                    // }
                    else if (lineText.match(endTypeRegex)) {
                        curDepth--;
                        for (let h=0; h< curDepth; h++) {
                            formattedText = formattedText + '\t';
                        }
                        formattedText += lineText + '\n';
                    }

                    else if ( lineText.match(elseifRegex) || lineText.match(elseRegex)) {
                        curDepth--;
                        for (let h=0; h< curDepth; h++) {
                            formattedText = formattedText + '\t';
                        }
                        formattedText += lineText + '\n';
                        curDepth++;
                    }  


                    

                    else {
                        for (let h=0; h< curDepth; h++) {
                            formattedText = formattedText + '\t';
                        }
                        formattedText += lineText + '\n';    
                    
             

                        if (matchBlock(lineText)) {
                            
                            curDepth++;
                            
                        }
                }
                   
                  


                }

                return formattedText;

                

        }


        
    }
    