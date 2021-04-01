import $ from "jquery";
import Handlebars from "handlebars";
import toc from './TableOfContents/TableOfContents.html';
import chap from "./TableOfContents/Chapter/chapter.html";
import part from "./TableOfContents/Part/part.html";
import Prol from "./TableOfContents/Part/part.html";
import write from "./middle/middle.html";
import './editor.scss';
import './middle/middle.scss';
import './TableOfContents/Chapter/chapter.scss';
import './TableOfContents/Part/part.scss';

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
  $(location).append(template(data));
}

async function Prologue(data, location) {
  var template = Handlebars.compile(Prol);
  $(location).append(template(data));
}

async function Word(data, location) {
  var words = '<p>{{word-count}}</p>';
  var template = Handlebars.compile(words);
  $(location).append(template(data));
}

async function Write(data, location) {
  var template = Handlebars.compile(write);
  $(location).append(template(data));
}

export {TableOfContents, Chapter, Part, Prologue, Word, Write};
