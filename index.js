import $ from 'jquery';
import 'firebase/auth';
import 'firebase/firestore';
import './Module/firebase/startfire.js';
import './style.css';
import './Module/toolbar/toolbar.js';
import './Module/BookMenu/bookmenu.js';
import './Module/Editor/editor.js';
import './Module/world/world.js';
import './Module/login/login.js';

$(document).ready(function(){ //initial load technically should be done after login so needs to be moved.
$('#booklist-menu').trigger('click');
$('book booktitle').last().trigger('click');
});













