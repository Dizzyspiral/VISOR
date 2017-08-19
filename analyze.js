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
    analyses.push(new Analysis(len_analysis, "yellow", document.getElementById(len_analysis)));
}

function getActiveAnalyses() {
    var active_analyses = [];
    var pv_checkbox = document.getElementById("passive_voice");
    var adv_checkbox = document.getElementById("adverbs");
    var rep_checkbox = document.getElementById("repetiton");
    var len_checkbox = document.getElementById("sentence_length");
    
    if (pv_checkbox.checked) { 
        active_analyses.push(pv_analysis)
    }

    return active_analyses;
}

function analyze() {
    if (analyses.length == 0) {
        initializeAnalyses();
    }

    var text_area = document.getElementById("user_text");
    text = text_area.value;
    var active_analyses = getActiveAnalyses();

//    console.log(active_analyses);

    for (var i = 0; i < active_analyses.length; i++) {
        console.log(active_analyses[i]);
        if (active_analyses[i].checkbox.checked) {
            highlights.extend(active_analyses[i].analyze(text));
        }
    }

    /* Then we need to do the hard part of figuring out if there are any overlapping highlighted areas,
     * and if so, which is bigger so that we can nest the span for the smaller one inside of it
     */
}

/**
 * Returns the character positions of text that should be highlighted as a result of this analysis
 */
function pv_analysis (text) {
    
}

function adv_analysis(text) {

}

function rep_analysis(text) {
    var words = text.split(" ");
    var cur_pos = 0;
    recent_words = [];
    highlights = [];
    
    for (var i = 0; i < words.length; i++) {
        if (recent_words.includes(words[i])) {
            highlights.push(new Highlight(cur_pos, cur_pos + words[i].length), this.color);
        }
        if (recent_words.length > 5) {
            recent_words.shift();
        }
    
        cur_pos += words[i].length;
    }

    return highlights;
}

function len_analysis(text) {

}
