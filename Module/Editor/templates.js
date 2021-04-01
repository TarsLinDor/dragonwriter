import $ from "jquery";
import Handlebars from "handlebars";
import chap from "./TableOfContents/Chapter/chapter.html";
import part from "./TableOfContents/Part/part.html";
import Prol from "./TableOfContents/Part/part.html";
import editor from "./editor.html";
import './editor.scss';
import "./TableOfContents/Chapter/chapter.scss";
import "./TableOfContents/Part/part.scss";

async function Editor(data, location) {
  var template = Handlebars.compile(editor);
  $(location).append(template(data));
}

async function Chapter(data, location) {
  var template = Handlebars.compile(chap);
  $(location).append(template(data));
}

async function Part(data, location) {
  var template = Handlebars.compile(part);
  $(location).append(template(data));
}

async function Prologue(data, location) {
  var template = Handlebars.compile(Prol);
  $(location).append(template(data));
}

export { Editor, Chapter, Part, Prologue };
