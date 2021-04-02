import $ from "jquery";
import Handlebars from "handlebars";
import toc from "./TableOfContents/TableOfContents.html";
import chap from "./TableOfContents/Chapter/chapter.html";
import part from "./TableOfContents/Part/part.html";
import Prol from "./TableOfContents/Part/part.html";
import write_chap from "./middle/chap.html";
import titlepage from "./middle/title-page.html";
import draft from "./draft/draft.html";
import "./editor.scss";
import "./middle/middle.scss";
import "./TableOfContents/Chapter/chapter.scss";
import "./TableOfContents/Part/part.scss";
import "./draft/draft.scss";

async function TableOfContents(data, location) {
  var template = Handlebars.compile(toc);
  $(location).append(template(data));
}

async function Chapter(data, location) {
  var template = Handlebars.compile(chap);
  if(data.type=='prologue'){
    $(location).prepend(template(data));
  }
  else{
  $(location).append(template(data));
  }
}


async function Part(data, location) {
  var template = Handlebars.compile(part);
  $(location).prepend(template(data));
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
async function Draft(data, location) {
  var template = Handlebars.compile(draft);
  $(location).append(template(data));
}

export { TableOfContents, Chapter, Part, Prologue, Write_chap, TitlePage };
