var analyses = [];
var pv_checkbox_id = "passive_voice";
var adv_analysis_id = "adverbs";
var rep_analysis_id = "repetition";
var len_analysis_id = "sentence_length";
var analyzed_text_id = "analyzed_text";

function highlight (text, style) {
    h = document.createElement("span");
    h.class = style;
    h.appendChild(document.createTextNode(text));
    return h;
}

class Analysis {
    constructor(func, color, checkbox) {
        this.func = func;
        this.checkbox = checkbox;
        this.color = color;
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
        var h = document.createElement("span");
        h.style.background = this.color;
        h.appendChild(document.createTextNode(text.slice(this.start, this.end + 1)));
        return h;
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

    for (var i = 0; i < analyses.length; i++) {
        if (analyses[i].checkbox.checked) {
            console.log(analyses[i].color);
            highlights.push.apply(highlights, analyses[i].analyze(text, analyses[i].color));
        }
    }

    /* Then we need to do the hard part of figuring out if there are any overlapping highlighted areas,
     * and if so, which is bigger so that we can nest the span for the smaller one inside of it
     */
    
    var analysis_div = document.getElementById(analyzed_text_id);
    analysis_div.innerHTML = "";
    
    /* We go through the string one character at a time, looking for the start and end positions of 
     * highlights. If two highlights overlap, we want to just add whatever one starts first. It's the
     * lazy man's solution - this problem is complicated. We could add a smaller highlight as a child of
     * another, for highlights completely subsumed by a larger one, but what about highlights that overlap
     * but extend beyond the boundary of the first? There is no spannable solution to this. We'd have to 
     * start drawing text with canvas and using rectangles for background highlights. No thank you.
     */
    var highlighted = false;

    for (i = 0; i < text.length; i++) {
        highlighted = false;

        for (var j = 0; j < highlights.length; j++) {
            if (highlights[j].start == i) {
                console.log(i);
                console.log(highlights[j]);
                s = highlights[j].createSpan(text);
                console.log(s);
                analysis_div.appendChild(s);
                i = highlights[j].end;
                highlighted = true;
                // Break out of the for loop, so we don't add more highlights for this position and duplicate text
                break;
            }
        }

        // If we didn't add a highlight for this letter, append it to the text
        if (highlighted == false) {
            analysis_div.appendChild(document.createTextNode(text[i]));
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
    text = text.toLowerCase();
    var words = text.split(" ");
    var cur_pos = 0;
    recent_words = [];
    highlights = [];
    
    for (var i = 0; i < words.length; i++) {
        punctuationless = removePunctuation(words[i]);
        if (recent_words.includes(punctuationless)) {
            highlights.push(new Highlight(cur_pos, cur_pos + words[i].length, color));
        }

        recent_words.push(words[i]);

        if (recent_words.length > 5) {
            recent_words.shift();
        }
    
        cur_pos += words[i].length + 1; // We assume a single space, which is why we +1
    }

    return highlights;
}

function len_analysis(text, color) {

}
