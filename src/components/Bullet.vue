<script setup>
  import { ref } from "vue"
  import draggable from "vuedraggable";


  const props = defineProps({
    bullets: Array})

  const persistentClone = ref(null)
  const clonesNextSibling = ref(null)
  const bulletStyle = {
    'todo': '&#43;',
    'text': '',
    'note': '&#8211;',
  }


  function activateEditable(e) {
     if (e.target.classList.contains('bullet__text')) {
      e.target.setAttribute("contenteditable", true)
      e.target.focus()
    }
  }

  function deactivateEditable(e) {
    e.target.setAttribute("contenteditable", false)
  }

  function addPlaceholderToInitialPlace(e) {
    const el = e.item
    const index = e.oldIndex
    persistentClone.value = e.from.insertBefore(
      el.cloneNode(true),
      e.from.children[index+1]
    );
    persistentClone.value.style.position = 'inherit'
    persistentClone.value.classList.add('bullet--placeholder');
    el.classList.add('bullet--dragged-position');
    // mark next sibling to aviod dropping error. Dragged item can't be placed
    // before sibling (between chosen element and next element). Item can only
    // be placed on top of clone placeholder or anywhere else. But not before
    // next sibling.
    clonesNextSibling.value = persistentClone.value.nextSibling
    if (clonesNextSibling.value) {
      clonesNextSibling.value.classList.add('sibling');
    }
  }

  function removePlaceholder(e) {
    e.item.classList.remove('bullet--dragged-position')

    persistentClone.value.remove();
    persistentClone.value = null;

    if (clonesNextSibling.value) {
      clonesNextSibling.value.classList.remove('sibling')
    }
  }

  function move(e) {
    e.dragged.classList.remove('bullet--placeholder')
    // element can't be dropped before next sibling. Results in error
    if (e.related.classList.contains('sibling') && !e.willInsertAfter) {
      return false;
    }
    // element can't be dropped after placeholder
    if (e.related.classList.contains('bullet--placeholder') && e.willInsertAfter) {
      return false;
    }
    e.dragged.style.width = e.related.getBoundingClientRect().width - 5 + 'px'
    return true;
  }

  function highlightChosen(e) {
    e.item.classList.add('bullet--placeholder')
  }

  function unhighlightedChosen(e) {
    e.item.classList.remove('bullet--placeholder')
  }
</script>

<template>
  <draggable
    class="dragArea"
    tag="div"
    :list="bullets"
    :group="{ name: 'nested' }"
    item-key="id"
    :animation="100"
    :fallbackOnBody="false"
    :swapThreshold="0.65"
    :delay="1000"
    :disabled="false"
    :move="move"
    @choose="highlightChosen"
    @unchoose="unhighlightedChosen"
    @click="activateEditable"
    @start="addPlaceholderToInitialPlace"
    @end="removePlaceholder"
    >
    <template #item="{ element }">
      <div class="bullet">
        <div class="bullet__main">
          <div class="toggle" v-if="element.bullets.length > 0">&#8250;</div>
          <div class="bullet__type" v-if="element.style !== 'text'" v-html="bulletStyle[element.style]"></div>
          <div class="bullet__text" @blur="deactivateEditable">{{ element.text }}</div>
        </div>
        <div class="bullet__toggle">
          <bullet :bullets="element.bullets" @change="$emit('customChange')"/>
        </div>
      </div>
    </template>
  </draggable>
</template>

<style scoped>
  /* bullet styles */

  .bullet {
    padding-left: 5px;
    display: flex;
    flex-direction: column;
  }

  .bullet__main {
    display: flex;
    flex-direction: row;
    position: relative;
  }

  .bullet__text, .bullet__type {
    padding: 0.3rem;
  }

  .bullet__text {
    flex: 1;
    outline: none;
  }

  .bullet__toggle {
    padding-left: 1rem
  }

  .toggle {
    position: absolute;
    left: -16px;
    width: 16px;
    display: flex;
    justify-content: center;
    padding: 0.3rem 0rem;
    transform: rotate(0deg);
    /* color: #C9D8D8; */
  }

  /* drag and drop styles */

  .sortable-ghost {
    /* background-color: #C9D8D8 !important; */
    background-color: #555555 !important;
    position: fixed;
    overflow: hidden;
  }

  .bullet--placeholder {
    /* background-color: #C9D8D850 !important; */
    background-color: #55555550 !important;
    border-radius: 0.3rem;
  }
  .bullet--dragged-position {
    height: 5px;
    border-radius: 0.3rem;
    z-index: 100;
  }

  /* old */

  /* .dragArea {
    outline: 1px dashed;
    z-index: -10;
  } */

  /* .sortable-drag {
    background-color: #ffffff00 !important;
  }
  .sortable-chosen {
    background-color: #ffffff00;
  } */

</style>