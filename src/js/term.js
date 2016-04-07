/*
 * Taken from the jquery-console ReadMe.md
 */
// var container = $('<div class="console">');
var container = $('#console');
// $('body').append(container);
var controller = container.console({
  promptLabel: 'Demo> ',
  commandValidate:function(line){
    if (line == "") return false;
    else return true;
  },
  commandHandle:function(line){
      return [{msg:"=> [12,42]",
               className:"jquery-console-message-value"},
              {msg:":: [a]",
               className:"jquery-console-message-type"}]
  },
  autofocus:true,
  animateScroll:true,
  promptHistory:true,
  charInsertTrigger:function(keycode,line){
     // Let you type until you press a-z
     // Never allow zero.
     return !line.match(/[a-z]+/) && keycode != '0'.charCodeAt(0);
  }
});

/*
  Script: Everything will be scripted for the demo. Here is how the actions will
          be laid out.

          The story of the boy who cried "I would like to use Unix, please."
          1) What am I looking at?
          2) Context bar lists files, and gives instructions. (Elaborate later)
             * "Try finding the file you want, or making a new file"
             * "You are here!"
             * "This is how to navigate"
          3) My file is on the Desktop
          4) There are a whole bunch of mp3 files.
          5) Listen to a file
             * Your shell is busy playing a file. Click to stop
          6) Move a file to another directory
          7) Start to do it again
          8) Automation helper
          9) Show the results
          10) accidentally delete a file
          11) be presented the undo thing
          12) go to python directory
          13) lint python file
          14) be presented with diff, and asked if we should undo
          15) back to playing music.
 */
