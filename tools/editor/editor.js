


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
  placeholder: "     Oh! the places you'll go..."
});

const booktitle =document.getElementById('booktitle');
booktitle.contentEditable='true';
const Content_Title = document.getElementById('Content_Title');
Content_Title.contentEditable='true';



