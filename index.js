import 'firebase/auth';
import 'firebase/firestore';
import './Module/firebase/startfire.js';
import './style.css';
import $ from 'jquery';
import './Module/toolbar/toolbar.js';
import './Module/BookMenu/bookmenu.js';
import './Module/Editor/editor.js';
import './Module/world/world.js';
import './Module/login/login.js';

$(document).ready(function(){
  $('book').first().children('booktitle').trigger('click');
  $('#editor').trigger('click');
});













