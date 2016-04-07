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
    yield "The story of the boy who cried 'I would like to use Unix, please.'";
    yield rep("This undo is a test with html", "<b>GET FUCKED</b>");

    setMood("WARN");
    contextWindow("I AM AN ARTIST");
    // 1) What am I looking at?
    // 2) Context bar lists files, and gives instructions. (Elaborate later)
    // * "Try finding the file you want, or making a new file"
    // * "You are here!"
    // * "This is how to navigate"
    // 3) My file is on the Desktop
    yield " ";
    yield rep("f1.mp3   f2.mp3   f3.mp3   f4.mp3", "These are your current files.");

    setMood("INFO");
    contextWindow("ART ART ART");
    // 4) There are a whole bunch of mp3 files.
    // 5) Listen to a file
    // * Your shell is busy playing a file. Click to stop
    yield " ";
    yield rep("Playing File","Your shell is busy playing a file. Click to stop.");
    // 6) Move a file to another directory
    yield " ";
    yield rep("f2.mp3   f3.mp3   f4.mp3", "These are your current files.");

    setMood("GOOD");
    // 6) Move a file to another directory
    yield " ";
    yield rep("f2.mp3   f3.mp3   f4.mp3", "These are your current files.");

    setMood("NEUTRAL");
    // 7) Start to do it again
    // 8) Automation helper
    // 9) Show the results
    yield " ";
    yield rep("", "No files in the current directory.");
    // 10) accidentally delete a file

    yield " ";
    yield rep("f1.mp3   f2.mp3   f3.mp3   f4.mp3", "These are your current files.");

    yield " ";
    yield rep("f2.mp3   f3.mp3   f4.mp3", "These are your current files. undo");

    // 11) be presented the undo thing
    yield " ";
    yield rep("f1.mp3   f2.mp3   f3.mp3   f4.mp3", "These are your current files.");
    // 12) go to python directory
    yield " ";
    yield rep("myfile.py", "These are your current files.");
    // 13) lint python file
    yield " ";
    yield rep("myfile.py", "These are your current files. undo");
    // 14) be presented with diff, and asked if we should undo
    // 15) back to playing music.
}

// string of all possible colors
var COLORS = "color_warn_l color_warn_d \
              color_info_l color_info_d \
              color_good_l color_good_d \
              color_neutral_l color_neutral_d";

function setMood(mood) {
    // remove any current color
    $("#bar").removeClass(COLORS);
    $("#bar_button").removeClass(COLORS);

    // set new color
    switch (mood) {
        case "WARN":
            $("#bar").addClass("color_warn_l");
            $("#bar_button").addClass("color_warn_d");
            break;
        case "INFO":
            $("#bar").addClass("color_info_l");
            $("#bar_button").addClass("color_info_d");
            break;
        case "GOOD":
            $("#bar").addClass("color_good_l");
            $("#bar_button").addClass("color_good_d");
            break;
        case "NEUTRAL":
        default:
            $("#bar").addClass("color_neutral_d");
            $("#bar_button").addClass("color_neutral_l");
            break;
    }
}

function contextWindow(info) {
    var table = $('<table></table>').addClass("context_window");
    table = table.css("padding-left", "20px");
    table = table.css("padding-top", "20px");

    var row = $('<tr></tr>');
    row = row.append($('<td></td>').css("align", "right").text("[INFO] "));
    row = row.append($('<td></td>').css("align", "left").text(": " + info));
    table.append(row);

    $("#context").html(table);
}

var gen = scriptGen();
var container = $('#console');
var input = gen.next().value;

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
        if (input == "") return true;
        else return false;
    },

    /*
     * This actually returns a message. It will use a generator to deal with the
     * script. This generator may have side-effects.
     */
    commandHandle:function(line){
        var next = gen.next().value;
        input = gen.next().value;
        return next;
    }
});


/*
 * This grabs all keypresses, and passes them to jquery-term for the
 * 'hacker-typer' effect.
 */
$(controller.typer).keydown(function (e) {
    e.preventDefault();
    e.stopPropagation();

    controller.typer.consoleInsert(input[0]);
    input = input.substring(1);
});

