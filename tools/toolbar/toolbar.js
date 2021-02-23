const book = document.getElementById('book');
const selectbook = document.getElementById('selectbook');
const bookmenu = document.getElementById('bookmenu');
const edit = document.getElementById('edit');
const outline = document.getElementById('outline');
const world = document.getElementById('world');
const world_tool = document.getElementById('world_tool');
const character = document.getElementById('character');
const character_tool = document.getElementById('character_tool');
const magic = document.getElementById('magic');
const dictionary = document.getElementById('dictionary');
const note = document.getElementById('note');
const feedback = document.getElementById('feedback');
const print = document.getElementById('print');
const settings = document.getElementById('settings');
const stats = document.getElementById('stats');
const logout = document.getElementById('logout');
const app = document.getElementById('app');

book.addEventListener('click', 
  function(){
    if(app.style.right <='0px'){
    app.style.right ='300px';
    app.style.borderRadius ='5px';
    bookmenu.style.display ='grid';
    }
    else{
    app.style.borderRadius ='0px';
    app.style.right ='0px';
    bookmenu.style.display ='none';
    };
  });
//start conditions
editor.style.display ='grid';
world_tool.style.display ='grid';
editor.classList.add("full");
world_tool.style.display ='none';
character_tool.style.display ='none';
//world_tool.classList.add("second");

edit.addEventListener('click', 
  function(){
    if(editor.style.display =='grid'){
    editor.style.display ='none';
    editor.classList.add("full")
    }
    else{
    editor.style.display ='grid';
    editor.classList.add("full")
    };
  });

  world.addEventListener('click', 
  function(){
    if(world_tool.style.display =='grid'){
    world_tool.style.display ='none';
    editor.classList.add("full");
    editor.classList.remove("first");
    }
    else{
    world_tool.style.display ='grid';
    world_tool.classList.add("second")
    editor.classList.remove("full");
    editor.classList.add("first");
    };
  });

stats.addEventListener('click', 
  function(){
    if(app.style.right <='0px'){
    app.style.right ='300px';
    }
    else{
    app.style.right ='0px';
    };
  });
     settings.addEventListener('click', 
  function(){
    if(app.style.right <='0px'){
    app.style.right ='300px';
    }
    else{
    app.style.right ='0px';
    };
  });



