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
    // 1
    Bar.Color(Bar.NEUTRAL); Bar.Button();
    var files = ["Code", "Desktop", " Documents", "Downloads", "Music", "Pictures", "sync"];
    var dir = "/home/Asurada";
    Context.Files(files, dir);
    yield "# Let's learn to use the shell!";
    yield rep("", ":: Comment, not evaluated");

    // 2
    dir += "/Music";
    yield "cd Music";
    yield rep("", ":: " + dir);
    files = ["f1.mp3", "f2.mp3", "f3.mp3", "f4.mp3", "index.md"];
    Context.Files(files, dir);

    // 3
    yield "help list size";
    yield rep("", ":: you might use: ls --size");
    Bar.Color(Bar.INFO); Bar.Text("command search");

    var use = "<input type='submit' class='button color_info_d' value='Use'>"

    var map = new Map();
    map.set("ls --size ", use + " list directory contents ");
    map.set("find -size", use + " search for files in a directory hierarchy");
    map.set("du", use + " estimate file space usage");
    Context.Command(map);

    // 4
    yield "ls --size";
    yield rep("4961 f1.mp3\n2192 f2.mp3\n3976 f3.mp3\n8172 f4.mp3\n203 index.md");
    Bar.Color(Bar.NEUTRAL); Bar.Text(""); Bar.Button();
    Context.Files(files, dir);

    // 5
    yield "rm index.md";
    yield rep("removed 'index.md' UNDO", ":: type 'undo' to undo");
    Bar.Color(Bar.WARN); Bar.Text("file change"); Bar.Button("Undo");

    var diff = "diff --git a/index.md b/index.md<br>deleted file mode 100644<br>index 15ea782..0000000<br>--- a/index.md<br>+++ /dev/null<br><font color='#66D9EF'>@@ -1,4 +0,0 @@</font><br><font color='red'>-f1.mp3 - track one<br>-f2.mp3 - track two<br>-f3.mp3 - track three<br>-f4.mp3 - track four</font>";

    Context.Text(diff);

    //6
    yield "undo";
    yield rep("",":: undo 'rm index.md'");
    Bar.Color(Bar.NEUTRAL); Bar.Text(""); Bar.Button();
    Context.Files(files, dir);
    $("#undo").remove();

    // 7
    yield "help f2.mp3 ";
    yield rep("", ":: you might use: mplayer");
    Bar.Color(Bar.INFO); Bar.Text("command search");

    var use = "<input type='submit' class='button color_info_d' value='Use'>"

    var map = new Map();
    map.set("mplayer", use + " movie player for Linux");
    map.set("vlc", use + " the VLC media player");
    map.set("ffmpeg", use + " ffmpeg video converter");
    Context.Command(map);

    //8
    yield "mplayer f3.mp3";
    yield rep("MPlayer SVN-r37379 (C) 2000-2015 MPlayer Team\n210 audio & 441 video codecs\ndo_connect: could not connect to socket\nconnect: No such file or directory\nFailed to open LIRC support. You will not be able to use your remote control.\n\nPlaying f3.mp3.\nlibavformat version 56.25.101 (internal)\nAudio only file format detected.\nLoad subtitles in ./\n==========================================================================\nOpening audio decoder: [mpg123] MPEG 1.0/2.0/2.5 layers I, II, III\nAUDIO: 44100 Hz, 2 ch, s16le, 256.0 kbit/18.14% (ratio: 32000->176400)\nSelected audio codec: [mpg123] afm: mpg123 (MPEG 1.0/2.0/2.5 layers I, II, III)\n==========================================================================\n[AO OSS] audio_setup: Can't open audio device /dev/dsp: No such file or directory\nAO: [alsa] 44100Hz 2ch s16le (2 bytes per sample)\nVideo: no video\nStarting playback...\nA:   2.3 (02.2) of 393.0 (06:33.0)  0.4%\n\nExiting... (End of file)", ":: movie player : f3.mp3")
    Bar.Color(Bar.NEUTRAL); Bar.Text(""); Bar.Button();
    Context.Files(files, dir);

    //9
    yield "play f1.mp3";
    yield rep("",":: exited with 0");
    yield "play f2.mp3";
    yield rep("",":: exited with 0");
    Bar.Color(Bar.INFO); Bar.Text("automate"); Bar.Button("next");

    Context.Text("<i>Would you like to automate?</i><br><li>Choose Files</li><li>Preview Results</li><li>Run Automation</li>");

    //10
    yield "cd ~";
    yield rep("", ":: /home/Asurada");
    gen = scriptGen();
    return gen.next().value;
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

    static Files(files, directory) {
        Context.div.html("");

        var go = "<input type='submit' class='button color_info_l' value='";
        var content = "<ul><b>" + directory + "</b>:<br><br>";
        for (var file of files) {
            content += " " + go + file + "'> ";
        }
        content += "</ul>"

        Context.div.append($(content));
    }

    static Text(text) {
        Context.div.html("<ul>" + text + "<ul>");
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
$(controller.typer).unbind("keydown").bind("keydown", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.which == 13) {
        controller.typer.CT();
    } else if (input != "") {
        controller.typer.consoleInsert(input[0]);
        input = input.substring(1);
    }
});

