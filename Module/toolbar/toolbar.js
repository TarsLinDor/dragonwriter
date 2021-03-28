 import $ from "jquery";
 import './toolbar.css';

$('editor').hide();
$('app').addClass('full');
$('app').addClass('grid1');

$('toolbar').on('click','button', function(){
   $(this).toggleClass('selected');
   var items = $('toolbar row button.selected').length;
   var toolbar_item = $(this).attr('id');
   //$('app').prepend(items);
   if (items == 1){
      $('app').removeClass();
      $('app').addClass('full');
      $('app').addClass('grid1');
      $(toolbar_item).addClass('first');
      $(toolbar_item).toggle();
   }

    else if (items == 2){
      $('app').removeClass();
      $('app').addClass('full');
      $('app').addClass('grid2');
      $(toolbar_item).toggle();
    }

    else if (items == 3){
      $('app').removeClass();
      $('app').addClass('full');
      $('app').addClass('grid3');
      $('.first').css('grid-row','1/span 2');
      $(toolbar_item).toggle();
      }
    else if (items == 4){
      $('app').removeClass();
      $('app').addClass('full');
      $('app').addClass('grid3');
      $('.first').css('grid-row','1/span 1');
      $(toolbar_item).toggle();
      };
   

  if(toolbar_item == 'bookmenu'){
   $(this).toggleClass('selected');
   $('app').toggleClass('full');
   $('app').toggleClass('side');
  };

});