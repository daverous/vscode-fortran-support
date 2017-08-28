
import * as vscode from 'vscode';

export interface Variable {
    name: string;
    type?: string;
    lineNumber?: number;
}


export interface Subroutine {

    name: string;
    args: Variable[];
    docstr: string;
    lineNumber: number
}

export interface Function extends Subroutine {    

    return: Variable; // function is a subroutine with return type
}

export enum MethodType {
    Subroutine,
    Function
};



export function getDeclaredFunctions(document: vscode.TextDocument): Function[] {

    let lines = document.lineCount;
    let funcs = [];

    for (let i = 0; i < lines; i++) {
        let line: vscode.TextLine = document.lineAt(i);
        if (line.isEmptyOrWhitespace) continue;
        let newFunc = parseFunction(line.text)
        if(newFunc){
            funcs.push({...newFunc, lineNumber: i });
        }
    }
    return funcs;
}

export function getDeclaredSubroutines(document: vscode.TextDocument):Subroutine[]{

    let lines = document.lineCount;
    let subroutines = [];

    for (let i = 0; i < lines; i++) {
        let line: vscode.TextLine = document.lineAt(i);
        if (line.isEmptyOrWhitespace) continue;
        let newSubroutine = parseSubroutine(line.text)
        if(newSubroutine){
            subroutines.push({...newSubroutine, lineNumber: i });
        }
    }
    return subroutines;
}



export function getDeclaredSubroutinesVariablesAndFunctions(document: vscode.TextDocument):[Subroutine[],Function[],Variable[]]{
    
        let lines = document.lineCount;
        let subroutines = [];
        let funcs = [];
        let vars = [];
        for (let i = 0; i < lines; i++) {
            let line: vscode.TextLine = document.lineAt(i);
            if (line.isEmptyOrWhitespace) continue;
            let subFuct = parseSubroutineAndFunctions(line.text);

            if (subFuct != null) {
                if(subFuct.what == "sub"){
                    subroutines.push({...subFuct, lineNumber: i });
                }
                else if (subFuct.what == "func") {
                    funcs.push({...subFuct, lineNumber: i });
                }
                // else if (subFuct.what == "var") {
                //     vars.push({...subFuct, lineNumber: i });
                // }
            }
        }
        return [subroutines,funcs,vars];
    }



export const parseFunction = (line: string) => {

    return _parse(line, MethodType.Function);
}

export const parseSubroutine = (line: string) => {

    return _parse(line, MethodType.Subroutine);
}

export const parseSubroutineAndFunctions = (line: string) => {
    
        return _parse_new(line);
    }

export const _parse = (line: string, type: MethodType) => {

    const functionRegEx = /^(?!end)([a-zA-Z]+(\([\w.=]+\))*)*\s*function\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\((\s*[a-zA-Z_][a-zA-Z0-9_,\s]*)*\s*\)\s*(result\([a-zA-Z_][\w]*\))*/g;
    const subroutineRegEx = /subroutine\s*([a-zA-Z][a-zA-Z0-9_]*)\s*\((\s*[a-zA-Z][a-zA-z0-9_,\s]*)*\s*\)/g;
    const regEx = (type === MethodType.Subroutine) ? subroutineRegEx : functionRegEx;
    if (line.match(regEx) && type === MethodType.Function) {
        let [attr, kind_descriptor, name, argsstr, result] = regEx.exec(line).slice(1, 5);
        let args = (argsstr) ? parseArgs(argsstr) : [];
        return {
            name: name,
            args: args
        };
    } else if (line.match(regEx) && type === MethodType.Subroutine) {
        let [name, argsstr] = regEx.exec(line).slice(1);
        let args = (argsstr) ? parseArgs(argsstr) : [];
        return {
            name: name,
            args: args
        };
    } 

}


export const _parse_new = (line: string) => {
        line = line.trim()
        const functionRegEx = /^(?!end)([a-zA-Z]+(\([\w.=]+\))*)*\s*function\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\(*(\s*[a-zA-Z_][a-zA-Z0-9_,\s]*)*\s*\)*\s*(result\([a-zA-Z_][\w]*\))*/ig;
        const subroutineRegEx = /(^(?!end\s))subroutine\s*([a-zA-Z][a-zA-Z0-9_]*)\s*\(*(\s*[a-zA-Z][a-zA-z0-9_,\s]*)*\s*\)*/ig;
        const varibleDecRegEx = /([a-zA-Z]{1,}(\([a-zA-Z0-9]{1,}\))?)(\s*,\s*[a-zA-Z\(\)])*\s*::\s*([a-zA-Z_][a-zA-Z0-9_]*)/ig;
        if (line.match(functionRegEx)) {
            let [attr, kind_descriptor, name, argsstr, result] = functionRegEx.exec(line).slice(1, 5);
            let args = (argsstr) ? parseArgs(argsstr) : [];
            return {
                what: "func",
                name: name,
                args: args
            };
        } else if (line.match(subroutineRegEx)) {
            let temp =subroutineRegEx.exec(line)
            let name = temp[2]
            let argsstr = temp[3];
            // l/et [name, argsstr] = temp.slice(1);
            let args = (argsstr) ? parseArgs(argsstr) : [];
            return {
                what: "sub",
                name: name,
                args: args
            };
        } else if(line.match(varibleDecRegEx)) {
            let [matchExp, type, kind, props, name ] = varibleDecRegEx.exec(line)
            return {what: "var", name: name, type: type};
        } 
    
    }



export const parseArgs = (argsstr: string) => {
    let args = argsstr.trim().split(',');
    let variables: Variable[] = args.filter(name => validVariableName(name))
        .map(name => {
            return { name: name };
        });
    return variables;
}

export const validVariableName = (name: string) => {
    return name.trim().match(/^[a-zA-Z_][a-zA-Z0-9_]*$/) !== null;
}

