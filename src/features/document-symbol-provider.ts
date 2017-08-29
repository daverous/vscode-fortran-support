

import { CancellationToken, TextDocument, Position, Hover } from "vscode";

import * as vscode from 'vscode';
import { getDeclaredSubroutinesVariablesAndFunctions } from '../lib/functions';
import { getDeclaredVars } from '../lib/variables';

export class FortranDocumentSymbolProvider implements vscode.DocumentSymbolProvider {

    public provideDocumentSymbols(document: TextDocument, token: CancellationToken){

        let funcAndSubs = getDeclaredSubroutinesVariablesAndFunctions(document);
        let subs = funcAndSubs[0];
        let funcs = funcAndSubs[1];
        let v = funcAndSubs[2];
        let t = funcAndSubs[3];
        let p = funcAndSubs[4];
        let functions = funcs.map(fun => {

            let range = new vscode.Range(fun.lineNumber, 0, fun.lineNumber, 100);
            let location = new vscode.Location(document.uri,range);
            return new vscode.SymbolInformation(fun.name, vscode.SymbolKind.Function,fun.parent, location );
        });

        let packages = p.map(p => {
            
                        let range = new vscode.Range(p.lineNumber, 0, p.lineNumber, 100);
                        let location = new vscode.Location(document.uri,range);
                        if (p.parent != "") {
                            return new vscode.SymbolInformation(p.name, vscode.SymbolKind.Module,p.parent, location );
                        }
                        else {
                            return new vscode.SymbolInformation(p.name, vscode.SymbolKind.Module,p.parent, location );
                    }
        });

        let types = t.map(t => {
            
                        let range = new vscode.Range(t.lineNumber, 0, t.lineNumber, 100);
                        let location = new vscode.Location(document.uri,range);
                        if (t.parent != "") {
                            return new vscode.SymbolInformation(t.name, vscode.SymbolKind.Class,t.parent, location );
                        }
                        else {
                        return new vscode.SymbolInformation(t.name, vscode.SymbolKind.Class, range );
                    }
        });

        let subroutines = subs.map(sub => {

            let range = new vscode.Range(sub.lineNumber, 0, sub.lineNumber, 100);
            let location = new vscode.Location(document.uri,range);
            if (sub.parent != "") {
                return new vscode.SymbolInformation(sub.name, vscode.SymbolKind.Function,sub.parent, location );
            }
            else {
            return new vscode.SymbolInformation(sub.name, vscode.SymbolKind.Function, range );
            }
        });
        let vars = v.map(variable => {
            let range = new vscode.Range(variable.lineNumber, 0, variable.lineNumber, 100);
            let location = new vscode.Location(document.uri,range);
            let kind = vscode.SymbolKind.Variable;

            if (variable.type.includes('dimension')) {
                kind = vscode.SymbolKind.Array;
            }
            else {
                let actualType = variable.type.split('(')[0]
                switch(actualType.toLowerCase()) {
                    case("logical"):
                        kind = vscode.SymbolKind.Boolean
                        break;
                    case("integer"):
                        kind = vscode.SymbolKind.Number;
                        break;
                    case("real"):
                        kind = vscode.SymbolKind.Number;
                        break;
                    case("type"):
                        kind = vscode.SymbolKind.Object;
                        break;
                }
            }
            if (variable.parent != "") {
                return new vscode.SymbolInformation(variable.name, kind,variable.parent, location );
            }
            else {
                return new vscode.SymbolInformation(variable.name, kind, range );
            }
        });

        return [...functions, ...subroutines, ...vars,...packages];
    }

}