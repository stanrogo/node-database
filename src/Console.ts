/**
 * @file Console.ts
 * @description Override console output to the DOM text output area
 * @author Stanley Clark <me@stanrogo.com>
 * @version 0.0.1
 */

const textArea : Element = document.querySelector("textarea");

console.log = function() : void {
    textArea.innerHTML += '- ';
    const args : Array<any> = Array.prototype.slice.call(arguments);
    for(let i : number = 0; i < args.length; i++){
        textArea.innerHTML += `${args[i]} `;
    }
    textArea.innerHTML += '\n';
};

window.onerror = function(message, url, lineNumber) {
    console.log("JavaScript error: " + message + " on line " +
        lineNumber + " for " + url);
};