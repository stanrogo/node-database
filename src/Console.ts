const baseLogFunction : Function = console.log;

console.log = function() : void {

    baseLogFunction.apply(console, arguments);

    const args = Array.prototype.slice.call(arguments);
    for(let i : number = 0; i < args.length; i++){
        const textarea = document.querySelector("textarea");
        textarea.innerHTML += `\n${args[i]}`;
    }

};

window.onerror = function(message, url, linenumber) {
    console.log("JavaScript error: " + message + " on line " +
        linenumber + " for " + url);
};