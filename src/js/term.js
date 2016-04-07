/**
 * Builds a message to be given to the commandHandler.
 */
function rep(m, h){
    var resp = [];

    if(m) {
        resp.push({msg:m, className:"jquery-console-message-value"});
    }
    if(h) {
        resp.push({msg:h, className:"jquery-console-message-type"});
    }

    return resp;
}
/*
 * This generator represents every step in the simulation. ALL modifying the
 * state of the simulation will be triggered here. Every time the user hits enter
 * in the simulation, a new step will be run.
 */
function* scriptGen() {
    // The story of the boy who cried "I would like to use Unix, please."
    yield rep("This undo is a test with html", "<b>GET FUCKED</b>");
    // 1) What am I looking at?
    // 2) Context bar lists files, and gives instructions. (Elaborate later)
    // * "Try finding the file you want, or making a new file"
    // * "You are here!"
    // * "This is how to navigate"
    // 3) My file is on the Desktop
    yield rep("f1.mp3   f2.mp3   f3.mp3   f4.mp3", "These are your current files.");
    // 4) There are a whole bunch of mp3 files.
    // 5) Listen to a file
    // * Your shell is busy playing a file. Click to stop
    yield rep("Playing File","Your shell is busy playing a file. Click to stop.");
    // 6) Move a file to another directory
    yield rep("f2.mp3   f3.mp3   f4.mp3", "These are your current files.");
    // 7) Start to do it again
    // 8) Automation helper
    // 9) Show the results
    yield rep("", "No files in the current directory.");
    // 10) accidentally delete a file
    yield rep("f1.mp3   f2.mp3   f3.mp3   f4.mp3", "These are your current files.");
    yield rep("f2.mp3   f3.mp3   f4.mp3", "These are your current files. undo");
    // 11) be presented the undo thing
    yield rep("f1.mp3   f2.mp3   f3.mp3   f4.mp3", "These are your current files.");
    // 12) go to python directory
    yield rep("myfile.py", "These are your current files.");
    // 13) lint python file
    yield rep("myfile.py", "These are your current files. undo");
    // 14) be presented with diff, and asked if we should undo
    // 15) back to playing music.
}

var gen = scriptGen();
var container = $('#console');

var controller = container.console({
    welcomeMessage : '',
    promptLabel: 'Asurada > ',
    autofocus:true,
    animateScroll:true,
    promptHistory:true,

    /*
     * This will decide if you can ever hit return. I may use this to make sure
     * the script is being followed.
     */
    commandValidate:function(line){
        if (line == "") return false;
        else return true;
    },

    /*
     * This actually returns a message. It will use a generator to deal with the
     * script. This generator may have side-effects.
     */
    commandHandle:function(line){
        return gen.next().value;
    }
});
