import $ from "jquery";
import Sortable from "sortablejs";

async function Sort_TableOfContents(
  item,
  groupname,
  handleClass,
  pickClass,
  ignore
) {
  var el = document.getElementById(item);
  Sortable.create(el, {
    group: groupname,
    handle: handleClass,
    chosenClass: pickClass,
    filter: ignore,
    onEnd: function(/**Event*/ evt) {}
  });
}

export { Sort_TableOfContents };
