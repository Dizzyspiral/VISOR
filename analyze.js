var analyses = [];
var pv_checkbox_id = "passive_voice";
var adv_analysis_id = "adverbs";
var rep_analysis_id = "repetition";
var len_analysis_id = "sentence_length";
var analyzed_text_id = "analyzed_text";

class Analysis {
    constructor(func, color, checkbox) {
        this.func = func;
        this.checkbox = checkbox;
        this.color = color;
    }

    analyze(text) {
        var h = this.func(text, this.color);
        return h;
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
//    analyses.push(new Analysis(pv_analysis, "red", document.getElementById(pv_checkbox_id)));
    analyses.push(new Analysis(adv_analysis, "#a7c3f2", document.getElementById(adv_analysis_id)));
    analyses.push(new Analysis(rep_analysis, "#75c464", document.getElementById(rep_analysis_id)));
    analyses.push(new Analysis(len_analysis, "#fffd89", document.getElementById(len_analysis_id)));
}

function analyze() {
    if (analyses.length == 0) {
        initializeAnalyses();
    }

    var text_area = document.getElementById("user_text");
    text = text_area.value;
    highlights = [];
    var i = 0;
    var j = 0;

    /* Perform analyses */
    for (i = 0; i < analyses.length; i++) {
        if (analyses[i].checkbox.checked) {
            h = analyses[i].analyze(text, analyses[i].color);

            for (j = 0; j < h.length; j++) {
                highlights.push(h[j]);

                /* This is for debugging purposes, so we don't get into an unreasonably large (infinite) loop */
                if (j == 100) {
                    break;
                }
            }
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

        for (j = 0; j < highlights.length; j++) {
            if (highlights[j].start == i) {
                s = highlights[j].createSpan(text);
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
    var words = text.split(" ");
    var adv_highlights = [];
    var cur_pos = 0;

    for (var i = 0; i < words.length; i++) {
        var punctuationless = removePunctuation(words[i]);
        
        /* This is a very simple adverb test, where any word ending in 'ly' is considered an adverb */
        if (punctuationless[punctuationless.length - 2] == "l" && punctuationless[punctuationless.length - 1] == "y") {
            adv_highlights.push(new Highlight(cur_pos, cur_pos + words[i].length - 1, color));
        }

        cur_pos += words[i].length + 1; // +1 for space we removed
    }

    return adv_highlights;
}

function rep_analysis(text, color) {
    text = text.toLowerCase();
    var words = text.split(" ");
    var cur_pos = 0;
    recent_words = [];
    rep_highlights = [];
    
    for (var i = 0; i < words.length; i++) {
        var punctuationless = removePunctuation(words[i]);
        if (recent_words.includes(punctuationless)) {
            rep_highlights.push(new Highlight(cur_pos, cur_pos + words[i].length - 1, color));
        }

        recent_words.push(words[i]);

        if (recent_words.length > 5) {
            recent_words.shift();
        }
    
        cur_pos += words[i].length + 1; // We assume a single space, which is why we +1
    }

    return rep_highlights;
}

function len_analysis(text, color) {
    const sentence_length_threshold = 25;
    var sentences = text.split(/\.|!|\?/);
    len_highlights = [];
    cur_pos = 0;
    
    for (var i = 0; i < sentences.length; i++) {
        console.log(sentences[i]);
        words = sentences[i].split(" ");

        if (words.length > sentence_length_threshold) {
            len_highlights.push(new Highlight(cur_pos, cur_pos + sentences[i].length - 1, color));
         }

        cur_pos += sentences[i].length + 1; // +1 for the period that we took out
    }

    return len_highlights;
}
