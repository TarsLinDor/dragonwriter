import "./editor.css";
import $ from 'jquery';
import $ from 'jquery-ui';


var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }],
  ['clean']
];

var editor = new Quill('#quill-editor', {
  modules: {
    toolbar: toolbarOptions,
  },
  theme: 'snow',
  placeholder: "Oh! the places you'll go..."
});

$('#booktitle').attr('contenteditable', true); //makes the booktitle so that it can be edited/



