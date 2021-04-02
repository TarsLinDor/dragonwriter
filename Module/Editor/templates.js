import $ from "jquery";
import Handlebars from "handlebars";
import toc from "./TableOfContents/TableOfContents.html";
import chap from "./TableOfContents/Chapter/chapter.html";
import part from "./TableOfContents/Part/part.html";
import Prol from "./TableOfContents/Part/part.html";
import write_chap from "./middle/chap.html";
import titlepage from "./middle/title-page.html";
import "./editor.scss";
import "./middle/middle.scss";
import "./TableOfContents/Chapter/chapter.scss";
import "./TableOfContents/Part/part.scss";

async function TableOfContents(data, location) {
  var template = Handlebars.compile(toc);
  $(location).append(template(data));
}

async function Chapter(data, location) {
  var template = Handlebars.compile(chap);
  $(location).append(template(data));
}


async function Part(data, location) {
  var template = Handlebars.compile(part);
  var part_num = $('part').length;
  if (part_num == 0) {
    $(location).prepend(template(data));
  }
  else{
    var first = $('part').first().attr('value');
    var last = $('part').last().attr('value');
    if (first>=data.order){
      var next = $('part').first();
      next.before(template(data));
    }
    else if (last>=data.order){
      var next = $('part').first();
      next.after(template(data));
    }
  }
};

async function Prologue(data, location) {
  var template = Handlebars.compile(Prol);
  $(location).append(template(data));
}

async function Write_chap(data, location) {
  var template = Handlebars.compile(write_chap);
  $(location).append(template(data));
}
async function TitlePage(data, location) {
  var template = Handlebars.compile(titlepage);
  $(location).append(template(data));
}

export { TableOfContents, Chapter, Part, Prologue, Write_chap, TitlePage };
