import $ from "jquery";
import Handlebars from "handlebars";
import book from "./book/book.html";
import menu from "./menu.html";
import "./book/book.scss";
import "./menu.scss";

async function Book(data, location) {
  var template = Handlebars.compile(book);
  $(location).append(template(data));
}

async function Tag(data,location) {
  var tag = '<a class="tag">{{tag}}</a>';
  var template = Handlebars.compile(tag);
  $(location).append(template(data));
}

async function Menu(data, location) {
  var template = Handlebars.compile(menu);
  $(location).append(template(data));
}

export { Book, Tag, Menu };
