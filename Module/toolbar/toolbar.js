 import $ from "jquery";
 import './toolbar.css';

 $('toolbar').on('click','button', function(){
   $(this).toggleClass('selected');
 });

  $('#editor').addClass('full');
  $('app').addClass('full');
  $('app').addClass('grid1');
  $('#bookmenu').hide();