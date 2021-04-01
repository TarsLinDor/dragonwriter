import $ from "jquery";
import Handlebars from "handlebars";
import chap from "./Chapter/chapter.html";
import part from "./Part/part.html";
import Prol from "./Part/part.html";
import "./Chapter/chapter.scss";
import "./Part/part.scss";

async function Chapter(data, location) {
  var template = Handlebars.compile(chap);
  $(location).append(template(data));
};

async function Part(data, location) {
  var template = Handlebars.compile(part);
  $(location).append(template(data));
};

async function Prologue(data, location) {
  var template = Handlebars.compile(Prol);
  $(location).append(template(data));
};

export { Chapter, Part, Prologue };