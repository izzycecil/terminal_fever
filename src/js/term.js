/**
 * Builds a message to be given to the commandHandler.
 */
function msg(m, t){
    return [{msg:"=> " + m,
             className:"jquery-console-message-value"},
            {msg:":: " + t,
             className:"jquery-console-message-type"}]
}
/*
 * This generator represents every step in the simulation. ALL modifying the
 * state of the simulation will be triggered here. Every time the user hits enter
 * in the simulation, a new step will be run.
 */
function* scriptGen() {
    // The story of the boy who cried "I would like to use Unix, please."
    yield msg("Hey babe", "<3");
    yield msg("I love you", ":)")
    yield msg("<b>WHAT?</b>", ":)")

    // 1) What am I looking at?
    // 2) Context bar lists files, and gives instructions. (Elaborate later)
    // * "Try finding the file you want, or making a new file"
    // * "You are here!"
    // * "This is how to navigate"
    // 3) My file is on the Desktop
    // 4) There are a whole bunch of mp3 files.
    // 5) Listen to a file
    // * Your shell is busy playing a file. Click to stop
    // 6) Move a file to another directory
    // 7) Start to do it again
    // 8) Automation helper
    // 9) Show the results
    // 10) accidentally delete a file
    // 11) be presented the undo thing
    // 12) go to python directory
    // 13) lint python file
    // 14) be presented with diff, and asked if we should undo
    // 15) back to playing music.
}

var gen = scriptGen();

var container = $('#console');
var controller = container.console({
    welcomeMessage : '<3 <3 <3',
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
