<script setup>
  import { ref, defineExpose, computed } from "vue"
  import draggable from "vuedraggable";


  const props = defineProps({
    bullets: Array,
    main: Boolean})
  const emit = defineEmits([
    'customChange', 'updateText', 'changeToggle', 'addNewBulletToPage'])

  const persistentClone = ref(null)
  const clonesNextSibling = ref(null)
  const bulletStyle = {
    'text': {icon: '', crossed: false},
    'todo': {icon: '&#x25CF;', crossed: false},
    'important': {icon: '&#x25C6;', crossed: false},
    'done': {icon: '&#215;', crossed: true},
    'migrate': {icon: '&#xbb;', crossed: true},
    'future': {icon: '&#xab', crossed: true},
    'note': {icon: '&#8211;', crossed: false},
  }
  const bulletElements = ref({})
  const bulletChildElements = ref({})
  let CompleteBulletElements = computed(() => {
    let childElements = bulletChildElements.value
    let listOfChildElements = {}
    for (const x in childElements) {
      if (childElements[x] !== null) {
        listOfChildElements = {...listOfChildElements, ...childElements[x].CompleteBulletElements}
      }
    }
    return {...bulletElements.value, ...listOfChildElements}
  })

  defineExpose({CompleteBulletElements})


  function activateEditable(e) {
    if (e.target.classList.contains('bullet__text')) {
      e.target.setAttribute("contenteditable", true)
      e.target.focus()
    }
  }

  function deactivateEditable(e, bulletID) {
    e.target.setAttribute("contenteditable", false)
    emit('updateText', {bulletIDs: [bulletID], text: e.target.innerText})
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

  function updateText(payload, bulletID) {
    emit('updateText', {bulletIDs: [bulletID, ...payload.bulletIDs], text: payload.text})
  }

  function toggleBullet(bulletID, toggled) {
    emit('changeToggle', {bulletIDs: [bulletID], toggled: !toggled})
  }

  function changeToggle(payload, bulletID) {
    emit('changeToggle', {bulletIDs: [bulletID, ...payload.bulletIDs], toggled: payload.toggled})
  }

  function addNewBullet(bulletID) {
    emit('addNewBulletToPage', {bulletIDs: [bulletID]})
  }

  function addNewBulletToPage(payload, bulletID) {
    emit('addNewBulletToPage', {bulletIDs: [bulletID, ...payload.bulletIDs]})
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
    :swapThreshold="0.55"
    :delay="1000"
    :touchStartThreshold="20"
    :disabled="false"
    :move="move"
    @choose="highlightChosen"
    @unchoose="unhighlightedChosen"
    @start="addPlaceholderToInitialPlace"
    @end="removePlaceholder"
    >
    <template #item="{ element }">
      <div
        class="bullet"
        :class='{"bullet--bottom": main, "bullet--crossed": bulletStyle[element.style].crossed}'>
        <div class="bullet__main">
          <div
            class="toggle"
            :class='{"toggle--rotated": element.toggled}'
            v-if="element.bullets.length > 0"
            @click="toggleBullet(element.id, element.toggled)">
            &#x25B2;
          </div>
          <div
            class="bullet__type"
            v-if="element.style !== 'text'"
            v-html="bulletStyle[element.style].icon"></div>
          <div
            class="bullet__text"
            :class='{"bullet__text--done": bulletStyle[element.style].crossed}'
            :ref="(el) => (bulletElements[element.id] = el)"
            @click="activateEditable"
            @blur="deactivateEditable($event, element.id)"
            @keydown.enter.exact.prevent="addNewBullet(element.id)"
            @keydown.meta.enter.prevent="toggleBullet(element.id, element.toggled)"
            >{{ element.text }}</div>
        </div>
        <div class="bullet__toggle" v-if="element.toggled">
          <bullet
            :bullets="element.bullets"
            :main="false"
            :ref="(el) => (bulletChildElements[element.id] = el)"
            @change="$emit('customChange')"
            @updateText="updateText($event, element.id)"
            @changeToggle="changeToggle($event, element.id)"
            @addNewBulletToPage="addNewBulletToPage($event, element.id)"
            />
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
    font-size: 1.1rem;
    font-weight: 400;
  }

  .bullet--bottom {
    border-bottom: 1px solid #55555550;
    padding: 0.7rem 0rem;
  }

  .bullet--crossed {
    color: #55555550;
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

  .bullet__text:empty:not(:focus):before {
    content: '...';
    color: #55555550;
  }

  .bullet__text--done:not(:empty) {
    text-decoration: line-through;
  }

  .bullet__type {
    font-weight: 500;
    width: 15px;
    display: flex;
    justify-content: center;
  }

  .bullet__toggle {
    padding-left: 1rem;
  }

  .toggle {
    position: absolute;
    left: -16px;
    width: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    transform: rotate(90deg);
    color: #55555550;
    font-size: 0.8rem;
    cursor: pointer;
  }

  .toggle--rotated {
    transform: rotate(180deg);
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
    padding: 0;
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