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
    Bar.Color(Bar.NEUTRAL);
    Bar.Button();

    yield "# Let's learn to use the shell!";
    yield rep("", ":: Comment, not evaluated");

    yield "ls --get-money --get-paid";
    yield rep("f1.mp3   f2.mp3   f3.mp3   f4.mp3", ":: list directore contents");
    Bar.Color(Bar.INFO); Bar.Text("ls options");

    var map = new Map()
    map.set("-a, --all", "do not ignore entries starting with .");
    map.set("-l", "use a long listing format");
    Context.Command(map)

    yield "rm -rvf f1.mp3";
    yield rep("removed 'f1.mp3' undo",":: remove files or directories : f1.mp3");
    Bar.Color(Bar.WARN); Bar.Text("rm options"); Bar.Button("Undo");

    var map = new Map()
    map.set("-r, -R, --recursive", "remove directories and their contents recursively");
    map.set("-v, --verbose", "explain what is being done");
    map.set("-f, --force", "ignore nonexistent files and arguments, never prompt");
    Context.Command(map)

    yield "mkdir music";
    yield rep("undo", ":: make directories : music");
    Bar.Color(Bar.WARN); Bar.Text("mkdir options"); Bar.Button("Undo");

    var map = new Map()
    map.set("-p, --parents", "no error if existing, make parent directories as needed");
    map.set("-v, --verbose", "print a message for each created directory");
    Context.Command(map)

    yield "mv -vi -t music *.mp3";
    yield rep("'f1.mp3' -> 'music/f1.mp3'\n'f2.mp3' -> 'music/f2.mp3'\n'f3.mp3' -> 'music/f3.mp3' undo", ":: move (rename) files : f1.mp3 f2.mp3 f3.mp3");
    Bar.Color(Bar.WARN); Bar.Text("mv options"); Bar.Button("Undo");

    var map = new Map()
    map.set("-v, --verbose", "explain what is being done");
    map.set("-i, --interactive", "prompt before overwrite");
    map.set("-t, --target-directory=\"music\"", "move all SOURCE arguments into \"music\"");
    Context.Command(map)

    yield "cd music";
    yield rep("", ":: change the working directory : music");
    Bar.Color(Bar.NEUTRAL); Bar.Text(); Bar.Button();

    yield "mplayer f3.mp3";
    yield rep("MPlayer SVN-r37379 (C) 2000-2015 MPlayer Team\n210 audio & 441 video codecs\ndo_connect: could not connect to socket\nconnect: No such file or directory\nFailed to open LIRC support. You will not be able to use your remote control.\n\nPlaying f3.mp3.\nlibavformat version 56.25.101 (internal)\nAudio only file format detected.\nLoad subtitles in ./\n==========================================================================\nOpening audio decoder: [mpg123] MPEG 1.0/2.0/2.5 layers I, II, III\nAUDIO: 44100 Hz, 2 ch, s16le, 256.0 kbit/18.14% (ratio: 32000->176400)\nSelected audio codec: [mpg123] afm: mpg123 (MPEG 1.0/2.0/2.5 layers I, II, III)\n==========================================================================\n[AO OSS] audio_setup: Can't open audio device /dev/dsp: No such file or directory\nAO: [alsa] 44100Hz 2ch s16le (2 bytes per sample)\nVideo: no video\nStarting playback...\nA:   2.3 (02.2) of 393.0 (06:33.0)  0.4%\n\nExiting... (End of file)", ":: movie player : f3.mp3")
    Bar.Color(Bar.INFO); Bar.Text("mplayer options");

    var map = new Map()
    map.set("-quiet", "Make console output less verbose");
    map.set("-really-quiet", "Display even less output and status messages than with -quiet");
    Context.Command(map)
}

/*
 * This class contains all of the state for the bar.
 */
class Bar {
    static init() {
        // string of all possible colors
        Bar.colors = "color_warn_l color_warn_d \
                           color_info_l color_info_d \
                           color_good_l color_good_d \
                           color_neutral_l color_neutral_d";

        // the dom items
        Bar.bar = $("#bar");
        Bar.text = $("#bar-text");
        Bar.button = $("#bar-button");

        // the bar color schemes
        Bar.WARN = 0;
        Bar.INFO = 1;
        Bar.GOOD = 2;
        Bar.NEUTRAL = 3;
    }

    /*
     * Set the bar color, where color is one of
     * Bar.WARN, Bar.INFO, Bar.GOOD, or Bar.NEUTRAL
     */
    static Color(color) {
        // remove any current color class
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

    /*
     * Set the bar text.
     */
    static Text(text) { Bar.text.text(text); }

    /*
     * Set the button text. If text is not given, then the button will be made
     * hidden.
     */
    static Button(text) {
        if (!text) Bar.button.css("visibility", "hidden");
        else {
            Bar.button.css("visibility", "visible");
            Bar.button.val(text);
        }
    }
}

// setup bar static variables
Bar.init()

class Context {
    static init() {
        Context.div = $("#context");
    }

    static Command(options) {
        Context.div.html("");

        var content = "<table>";
        for (var [key, value] of options) {
            content += "<tr>";
            content += "<td class='cmd-left'>" + key + " :</td>";
            content += "<td class='cmd-right'>" + value + "</td>";
            content += "</tr>";
        }
        content += "</table>";

        Context.div.append($(content));
    }

    static Files(files) {
        Context.div.html("");

        var content = "<ul>";
        for (file in files) {
            content += "<li>" + file + "</li>";
        }
        content += "</ul>"

        Context.div.append($(content));
    }
}

Context.init()

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
