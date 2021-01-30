import "./editor.css";


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




