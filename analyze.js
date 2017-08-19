var analyses = [];
var pv_checkbox_id = "passive_voice";
var adv_analysis_id = "adverbs";
var rep_analysis_id = "repetition";
var len_analysis_id = "sentence_length";

function highlight (text, style) {
    h = document.createElement("span");
    h.class = style;
    h.appendChild(document.createTextNode(text));
    return h;
}

class Analysis {
    constructor(func, highlight_color, checkbox) {
        this.func = func;
        this.checkbox = checkbox;
        this.highlight_color = highlight_color;
    }

    analyze(text) {
        var highlights = this.func(text, this.color);
        return highlights;
    }
}

class Highlight {
    constructor(start, end, color) {
        this.start = start;
        this.end = end;
        this.color = color;
    }

    createSpan(text) {
        h = document.createElement("span");
        h.appendChild(document.createTextNode(text.slice(this.start, this.end)));
    }
}

function initializeAnalyses() {
    analyses.push(new Analysis(pv_analysis, "red", document.getElementById(pv_checkbox_id)));
    analyses.push(new Analysis(adv_analysis, "blue", document.getElementById(adv_analysis_id)));
    analyses.push(new Analysis(rep_analysis, "green", document.getElementById(rep_analysis_id)));
    analyses.push(new Analysis(len_analysis, "yellow", document.getElementById(len_analysis_id)));
}

function analyze() {
    if (analyses.length == 0) {
        initializeAnalyses();
    }

    var text_area = document.getElementById("user_text");
    text = text_area.value;
    highlights = [];

    console.log(analyses[0].checkbox.checked);
    console.log(analyses[1].checkbox.checked);
    console.log(analyses[2].checkbox.checked);
    console.log(analyses[3].checkbox.checked);

    for (var i = 0; i < analyses.length; i++) {
        if (analyses[i].checkbox.checked) {
            highlights.push.apply(highlights, analyses[i].analyze(text));
        }
    }

    console.log(highlights);

    /* Then we need to do the hard part of figuring out if there are any overlapping highlighted areas,
     * and if so, which is bigger so that we can nest the span for the smaller one inside of it
     */
    
    // Clear the text area (hopefully this removes the spans from previous analyses, too)
    text_area.value = "";
    
    /* We go through the string one character at a time, looking for the start and end positions of 
     * highlights. If two highlights overlap, we want to just add whatever one starts first. It's the
     * lazy man's solution - this problem is complicated. We could add a smaller highlight as a child of
     * another, for highlights completely subsumed by a larger one, but what about highlights that overlap
     * but extend beyond the boundary of the first? There is no spannable solution to this. We'd have to 
     * start drawing text with canvas and using rectangles for background highlights. No thank you.
     */
    for (i = 0; i < text.length; i++) {
        for (var j = 0; j < highlights.length; j++) {
            if (highlights[j].start == i) {
                s = highlights.createSpan();
                text_area.appendChild(s);
                i = highlights[j].end;
            }
            else {
                // This is wildly inefficient, I'm sure, but eh.
                text_area.appendChild(document.createTextNode(text[i]));
            }
        }
    }
}

/**
 * Removes punctuation from a string.
 * Credit to: https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
 */
function removePunctuation(text) {
    var punctuationless = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    var finalString = punctuationless.replace(/\s{2,}/g," ");
    return finalString;
}

/**
 * Returns the character positions of text that should be highlighted as a result of this analysis
 */
function pv_analysis (text, color) {
    
}

function adv_analysis(text, color) {

}

function rep_analysis(text, color) {
    console.log("Repetition analysis executing");
    text = text.toLowerCase();
    text = removePunctuation(text);
    var words = text.split(" ");
    var cur_pos = 0;
    recent_words = [];
    highlights = [];
    
    for (var i = 0; i < words.length; i++) {
        console.log("current word: " + words[i]);
        console.log("recent words: " + recent_words);
        if (recent_words.includes(words[i])) {
            console.log("Adding highlight for word " + words[i]);
            highlights.push(new Highlight(cur_pos, cur_pos + words[i].length, color));
        }

        recent_words.push(words[i]);

        if (recent_words.length > 5) {
            recent_words.shift();
        }
    
        cur_pos += words[i].length;
    }

    return highlights;
}

function len_analysis(text, color) {

}
