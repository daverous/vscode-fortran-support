
import * as vscode from 'vscode';

export interface Variable {
    name: string;
    type?: string;
    lineNumber?: number;
    parent?: string;
}

export interface Class {
    name: string;
    type?: string;
    lineNumber?: number;
    parent?: string;
}

export interface Package {
    name: string;
    type?: string;
    lineNumber?: number;
    parent?: string;
}


export interface Subroutine {

    name: string;
    args: Variable[];
    docstr: string;
    parent?: string;
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



export function getDeclaredSubroutinesVariablesAndFunctions(document: vscode.TextDocument):[Subroutine[],Function[],Variable[],Class[],Package[]]{
    
        let lines = document.lineCount;
        let subroutines = [];
        let funcs = [];
        let vars = [];
        let classes = [];
        let packs = [];
        let curBlock = [];
        for (let i = 0; i < lines; i++) {
            let line: vscode.TextLine = document.lineAt(i);
            if (line.isEmptyOrWhitespace) continue;
            let subFuct = parseSubroutineAndFunctions(line.text,curBlock[curBlock.length-1] );

            if (subFuct != null) {
                if (subFuct.what =="end") {
                    // pop item off the top of the stack 
                    curBlock.pop();
                }
                else if(subFuct.what == "program"){
                    curBlock.push(subFuct.name);
                    packs.push({...subFuct, parent  : subFuct.in,lineNumber: i });
                }
                else if(subFuct.what == "module"){
                    curBlock.push(subFuct.name);
                    packs.push({...subFuct, parent  : subFuct.in,lineNumber: i });
                }
                else if(subFuct.what == "inter"){
                    curBlock.push(subFuct.name);
                    classes.push({...subFuct, parent  : subFuct.in,lineNumber: i });
                }
                else if(subFuct.what == "sub"){
                    curBlock.push(subFuct.name);
                    subroutines.push({...subFuct, parent  : subFuct.in,lineNumber: i });
                }
                else if (subFuct.what == "func") {
                    curBlock.push(subFuct.name);
                    funcs.push({...subFuct,parent  : subFuct.in, lineNumber: i });
                }
                else if (subFuct.what == "var") {
                    vars.push({...subFuct, lineNumber: i , parent  : subFuct.in, type : subFuct.type});
                }
                else if (subFuct.what == "class") {
                    curBlock.push(subFuct.name);
                    classes.push({...subFuct, lineNumber: i , parent  : subFuct.in, type : subFuct.type});
                }
            }
        }
        return [subroutines,funcs,vars, classes,packs];
    }



export const parseFunction = (line: string) => {

    return _parse(line, MethodType.Function);
}

export const parseSubroutine = (line: string) => {

    return _parse(line, MethodType.Subroutine);
}

export const parseSubroutineAndFunctions = (line: string, curSubName : string) => {
    
        return _parse_new(line,curSubName);
    }

export const _parse = (line: string, type: MethodType) => {

    const functionRegEx = /^(?!end)([a-zA-Z]+(\([\w.=]+\))*)*\s*function\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\((\s*[a-zA-Z_][a-zA-Z0-9_,\s]*)*\s*\)\s*(result\([a-zA-Z_][\w]*\))*/g;
    const subroutineRegEx = /subroutine\s*([a-zA-Z][a-zA-Z0-9_]*)\s*\((\s*[a-zA-Z][a-zA-z0-9_,\s]*)*\s*\)/g;
    const interfaceRegEx = /subroutine\s*([a-zA-Z][a-zA-Z0-9_]*)\s*\((\s*[a-zA-Z][a-zA-z0-9_,\s]*)*\s*\)/g;
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


export const _parse_new = (line: string, parent: string) => {
        line = line.trim()
        const functionRegEx = /^(?!end)([a-zA-Z]+(\([\w.=]+\))*)*\s*function\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\(*(\s*[a-zA-Z_][a-zA-Z0-9_,\s]*)*\s*\)*\s*(result\([a-zA-Z_][\w]*\))*/ig;
        const subroutineRegEx = /(^(?!end\s))subroutine\s*([a-zA-Z][a-zA-Z0-9_]*)\s*\(*(\s*[a-zA-Z][a-zA-z0-9_,\s]*)*\s*\)*/ig;
        const varibleDecRegEx = /(([a-zA-Z]{1,})(\(kind=*[a-zA-Z0-9]{1,}\))?(,\s*[a-zA-Z0-9]{1,}(\(.*\))?)*)\s*::\s*([a-zA-Z_][a-zA-Z0-9_]*)/ig;
        const typeDecRegEx = /type(,\s*[a-zA-Z0-9]{1,}(\(.*\))?)*\s*::\s*([a-zA-Z_][a-zA-Z0-9_]*)/ig;
        const interfaceRegEx = /^interface\s*([a-zA-Z][a-zA-Z0-9_]*)\s*\(*(\s*[a-zA-Z][a-zA-z0-9_,\s]*)*\s*\)*/ig;
        const endRegex = /^((?!(end\s*block|end\s*if|end\s*select|end\s*do))end)/ig; // regex means that ends won't work for inside
        // TODO should use a stack to build a higherarchy, these should have a parent depth parameter, 
        const programRegex = /^program\s+([a-zA-Z][a-zA-Z0-9_]*)\s*\(*(\s*[a-zA-Z][a-zA-z0-9_,\s]*)*\s*\)*/ig;
        const moduleRegex = /^module\s+([a-zA-Z][a-zA-Z0-9_]*)\s*\(*(\s*[a-zA-Z][a-zA-z0-9_,\s]*)*\s*\)*/ig;

        if (line.match(endRegex)) {
            return {
                what: "end",
                name: "",
                args: "",
                type : "",
                in: ""
            }
        }
        else if (line.match(functionRegEx)) {
            let [attr, kind_descriptor, name, argsstr, result] = functionRegEx.exec(line).slice(1, 5);
            let args = (argsstr) ? parseArgs(argsstr) : [];
            return {
                what: "func",
                name: name,
                args: args,
                type: kind_descriptor,
                in: parent
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
                args: args,
                type : "",
                in: parent // add a field to show if the variable is in
            };
        } else if(line.match(typeDecRegEx)) {
            
            let [matchExp, type, name ] = typeDecRegEx.exec(line);
            return {what: "class", name: name, type: type, in: parent};
        } else if(line.match(interfaceRegEx)) {
            
            let [matchExp, name ] = interfaceRegEx.exec(line);
            return {what: "inter", name: name, type: "", in: parent};
        } else if(line.match(varibleDecRegEx)) {
            
            let [matchExp, type, kind, props,temp,temp2, name ] = varibleDecRegEx.exec(line)
            return {what: "var", name: name, type: type, in: parent};
        } else if(line.match(programRegex)) {
            
            let [matchExp, name ] = programRegex.exec(line);
            return {what: "program", name: name, type: "", in: parent};
        }
        else if(line.match(moduleRegex)) {
            
            let [matchExp, name ] = moduleRegex.exec(line);
            return {what: "module", name: name, type: "", in: parent};
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

