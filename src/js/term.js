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

    Bar.color(Bar.WARN);
    contextWindow("[HEY LOUIS]", "I AM AN ARTIST");
    contextWindow("[WILL COLUMN THIS RESIZE?]", "ART ART ART");
    // 1) What am I looking at?
    // 2) Context bar lists files, and gives instructions. (Elaborate later)
    // * "Try finding the file you want, or making a new file"
    // * "You are here!"
    // * "This is how to navigate"
    // 3) My file is on the Desktop
    yield "ls --get-money --get-paid";
    yield rep("f1.mp3   f2.mp3   f3.mp3   f4.mp3", "These are your current files.");
    contextWindow();
    contextWindow("[MY HANDS]", "ARE TYPING WORDS");
    contextWindow("[THIS]", "IS A NIGHTMARE");
    Bar.color(Bar.INFO);
    // 4) There are a whole bunch of mp3 files.
    // 5) Listen to a file
    // * Your shell is busy playing a file. Click to stop
    yield " ";
    yield rep("Playing File","Your shell is busy playing a file. Click to stop.");
    // 6) Move a file to another directory
    yield " ";
    yield rep("f2.mp3   f3.mp3   f4.mp3", "These are your current files.");

    Bar.color(Bar.GOOD);
    // 6) Move a file to another directory
    yield " ";
    yield rep("f2.mp3   f3.mp3   f4.mp3", "These are your current files.");

    Bar.color(Bar.NEUTRAL);
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

class Bar {
    static init() {
        // string of all possible colors
        Bar.colors = "color_warn_l color_warn_d \
                           color_info_l color_info_d \
                           color_good_l color_good_d \
                           color_neutral_l color_neutral_d";

        Bar.bar = $("#bar");
        Bar.text = $("#bar-text");
        Bar.button = $("#bar-button");

        Bar.WARN = 0;
        Bar.INFO = 1;
        Bar.GOOD = 2;
        Bar.NEUTRAL = 3;
    }

    static color(color) {
        // remove any current color
        Bar.bar.removeClass(Bar.colors);
        Bar.button.removeClass(Bar.colors);

        // set new color
        switch (color) {
            case Bar.WARN:
                Bar.bar.addClass("color_warn_l");
                Bar.button.addClass("color_warn_d");
                break;
            case Bar.INFO:
                Bar.bar.addClass("color_info_l");
                Bar.button.addClass("color_info_d");
                break;
            case Bar.GOOD:
                Bar.bar.addClass("color_good_l");
                Bar.button.addClass("color_good_d");
                break;
            case Bar.NEUTRAL:
            default:
                Bar.bar.addClass("color_neutral_d");
                Bar.button.addClass("color_neutral_l");
                break;
        }
    }

    static text(text) { Bar.text.text(text); }

    static button(text) {
        if (text == null) Bar.button.css("visibility:hidden");
        else Bar.button.val(text);
    }
}

Bar.init()

function contextWindow(title, info) {
    if (!title) {
        $("#context").html("");
    } else {
        if ($("#context").html() == "") {
            var table = $('<table></table>').addClass("context_window");
            $("#context").append(table);
        }

        var row = $('<tr></tr>');
        row = row.append($('<td></td>').attr("align", "right").text(title));
        row = row.append($('<td></td>').attr("align", "left").text(": " + info));
        $(".context_window").append(row);
    }
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

    if (input != "" && e.which != 13) {
        controller.typer.consoleInsert(input[0]);
        input = input.substring(1);
    }
});
