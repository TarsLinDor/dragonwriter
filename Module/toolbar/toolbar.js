 import $ from "jquery";
 import './toolbar.scss';
 import toolbar from './toolbar.html';
$('toolbar').html(toolbar);

$('editor').hide();
$('world').hide();
$('app').addClass('full');
$('app').addClass('grid1');

$('toolbar').on('click','button', function(){
   $(this).toggleClass('selected');
   var items = $('toolbar row button.selected').length;
   var toolbar_item = $(this).attr('id');
  if(toolbar_item == 'booklist-menu'){
      $(this).toggleClass('selected');
      $('app').toggleClass('full');
      $('app').toggleClass('side');
    }
  else {
   //$('app').prepend(items);
   if (items == 0){
      $('app').removeClass('grid2 grid3 grid4');
      $('app').addClass('grid1');
      $(toolbar_item).removeClass('first');
      $(toolbar_item).hide();
   }

   if (items == 1){
      $('app').removeClass('grid2 grid3 grid4');
      $('app').addClass('grid1');
      $(toolbar_item).addClass('first');
      $(toolbar_item).toggle();
   }

    else if (items == 2){
      $('app').removeClass('grid1 grid3 grid4');
      $('app').addClass('grid2');
      $(toolbar_item).toggle();
    }

    else if (items == 3){
     $('app').removeClass('grid2 grid1 grid4');
      $('app').addClass('grid3');
      $('.first').css('grid-row','1/span 2');
      $(toolbar_item).toggle();
      }
    else if (items == 4){
     $('app').removeClass('grid2 grid3 grid1');
      $('app').addClass('grid4');
      $('.first').css('grid-row','1/span 1');
      $(toolbar_item).toggle();
      };
  };


});

