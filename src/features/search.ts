// import * as vscode from 'vscode';
// import {ProgramPart} from '../lib/functions';
// function searchForDecleration(document: vscode.TextDocument, word : string):
//             boolean { 
//                 let lines = document.lineCount; 
                

//                 let curPart : ProgramPart[]
//                 for (let i = 0; i < lines; i++) {
//                     let line: vscode.TextLine = document.lineAt(i);
//                     let lineText = line.text;


//                     let subFuct = parseSubroutineAndFunctions(line.text,curPart[curPart.length-1] );
                    
                    
                               
//                                 if (subFuct != null) {
//                                     if (subFuct.what =="end") {
//                                         // pop item off the top of the stack 
//                                         curPart.pop();
//                                     }
//                                     else if(subFuct.what == "program"){
//                                         curPart.push(subFuct.name);
//                                         packs.push({...subFuct, parent  : subFuct.in,lineNumber: i });
//                                     }
//                                     else if(subFuct.what == "module"){
//                                         curBlock.push(subFuct.name);
//                                         packs.push({...subFuct, parent  : subFuct.in,lineNumber: i });
//                                     }
//                                     else if(subFuct.what == "inter"){
//                                         curBlock.push(subFuct.name);
//                                         classes.push({...subFuct, parent  : subFuct.in,lineNumber: i });
//                                     }
//                                     else if(subFuct.what == "sub"){
//                                         curBlock.push(subFuct.name);
//                                         subroutines.push({...subFuct, parent  : subFuct.in,lineNumber: i });
//                                     }
//                                     else if (subFuct.what == "func") {
//                                         curBlock.push(subFuct.name);
//                                         funcs.push({...subFuct,parent  : subFuct.in, lineNumber: i });
//                                     }
//                                     else if (subFuct.what == "var") {
//                                         vars.push({...subFuct, lineNumber: i , parent  : subFuct.in, type : subFuct.type});
//                                     }
//                                     else if (subFuct.what == "class") {
//                                         curBlock.push(subFuct.name);
//                                         classes.push({...subFuct, lineNumber: i , parent  : subFuct.in, type : subFuct.type});
//                                     }
//                                 }
//                             } 



//                 }



                
//                 return false;

//             }