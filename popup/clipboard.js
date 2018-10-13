const clipLabels = ["clipA", "clipB", "clipC", "clipD", "clipE", "clipF", "clipG", "clipH", "clipI", "clipJ"];

function loadClips() {
    for (var i in clipLabels) {
        currentClip = clipLabels[i];
        browser.storage.local.get({
            [currentClip]: ""
        }, function(clip) {
            var clipToUpdate = document.getElementById(Object.keys(clip)[0]);
            clipToUpdate.value = clip[Object.keys(clip)[0]];
            clipToUpdate.setAttribute("title", clipToUpdate.value);
        });
    }
}

function listenForChanges() {
    $(".clip").on("input", function(e) {
        var input = $(this);
        var val = input.val();
        currentClip = e.target.id;
        if (input.data("lastval") != val) {
            input.data("lastval", val);
            browser.storage.local.set({
                [currentClip]: val
            });
            e.target.setAttribute("title", val);
        }
    });
    $(".clip").on("focus", function() {
        this.select();
    });


    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("reset")) {
            var clips = document.getElementsByClassName("clip");
            for (var i = 0; i < clips.length; i++) {
                clips[i].value = "";
            }
            for (var i in clipLabels) {
                currentClip = clipLabels[i];
                browser.storage.local.set({
                    [currentClip]: ""
                })
            }
        } else if (e.target.classList.contains("copy")) {
            var toCopy = "clip" + e.target.id.split("copy")[1];
            document.getElementById(toCopy).select();
            document.execCommand("copy");
        } else if (e.target.classList.contains("paste")) {
            var copyFrom = document.createElement("textarea");
            copyFrom.setAttribute("contenteditable", true);
            copyFrom.setAttribute("id", "middlemanTextbox");
            document.body.appendChild(copyFrom);
            copyFrom.focus();
            document.execCommand("paste");
            var clipToReplace = document.getElementById("clip" + e.target.id.split("paste")[1]);
            clipToReplace.value = copyFrom.value;
            browser.storage.local.set({
                [clipToReplace.id]: copyFrom.value
            });
            clipToReplace.setAttribute("title", copyFrom.value);
            document.body.removeChild(copyFrom);
        }
    });
}
loadClips();
listenForChanges();