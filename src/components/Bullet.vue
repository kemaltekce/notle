<script setup>
  import { ref, defineExpose, computed, onUpdated, inject} from "vue"
  import _ from 'lodash'
  import draggable from "vuedraggable";

  import Cmdbar from '../components/Cmdbar.vue'

  import focus from "../utils/focus"


  const props = defineProps({
    bullets: Array,
    main: Boolean})
  // inject page to get access to editModeBulletID. Variable is defined here.
  // But it has to be deactivated and set to null inside the page view.
  // Because the deactivatation is part of a event listener. Adding the event
  // listener to the bullet component caused the problem of adding multiple
  // listeners because the bullet component can be mounted multiple times to the
  // dom.
  const page = inject('page')
  const emit = defineEmits([
    'customChange', 'updateText', 'changeToggle', 'addNewBulletToPage',
    'indentBulletToSibling', 'unindentBulletToParent', 'removeBulletStyle',
    'removeBullet'])

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

  onUpdated(() => {
    // reset both variables to remove removed bullets
    bulletElements.value = {}
    bulletChildElements.value = {}
  })


  function activateEditable(e, bulletID) {
    if (e.target.classList.contains('bullet__text')) {
      focus(e.target)
      page.setEditModeBulletID(bulletID)
    }
  }

  function activateEditMode(bulletID) {
    page.setEditModeBulletID(bulletID)
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

  function indentBullet(e, bulletID) {
    const bulletIndex = _.findIndex(props.bullets, {'id': bulletID})
    if (bulletIndex === 0) {
      return
    }
    // event e only exists if function is called by keypresses.
    // if function is called via click on cmd bar, bullet will be automatically
    // blured and event e doesn't exist.
    if (e) {
      e.target.blur()
    }
    emit('indentBulletToSibling', {bulletIDs: [bulletID]})
  }

  function indentBulletToSibling(payload, bulletID) {
    emit('indentBulletToSibling', {bulletIDs: [bulletID, ...payload.bulletIDs]})
  }

  function unindentBullet(e, bulletID) {
    if (props.main) {
      return
    }
    // event e only exists if function is called by keypresses.
    // if function is called via click on cmd bar, bullet will be automatically
    // blured and event e doesn't exist.
    if (e) {
      e.target.blur()
    }
    emit('unindentBulletToParent', {bulletIDs: [bulletID]})
  }

  function unindentBulletToParent(payload, bulletID) {
    emit('unindentBulletToParent', {bulletIDs: [bulletID, ...payload.bulletIDs]})
  }

  function runCmd(payload, bulletID) {
    if (payload.name === 'indent') {
      const bulletIndex = _.findIndex(props.bullets, {'id': bulletID})
      // if bullet can not be indented, do nothing. Bullet is frist bullet in
      // list
      if (bulletIndex === 0) {
        // click on cmd bar blurs the bullet. Get focus back on the bullet
        focus(CompleteBulletElements.value[bulletID])
        return
      }
      indentBullet(null, bulletID)
    }
    // if bullet can not be unindented, because it is part of the main bullet
    // list, do nothing
    else if (payload.name === 'unindent') {
      if (props.main) {
        // click on cmd bar blurs the bullet. Get focus back on the bullet
        focus(CompleteBulletElements.value[bulletID])
        return
      }
      unindentBullet(null, bulletID)
    }
  }

  function remove(e, bulletID, bulletStyle) {
    if (window.getSelection()['anchorOffset'] > 0) {return}

    // remove bullet style if it is not simple text. Change bullet style from
    // current style to just text. Additionally, also update the text of the
    // bullet
    if (bulletStyle !== 'text') {
      emit(
        'removeBulletStyle', {bulletIDs: [bulletID], text: e.target.innerText})
      return
    }

    // if bullet style is simple text and the bullet text is empty remove the
    // bullet
    if ((bulletStyle === 'text') & (e.target.innerText.length === 0)) {
      emit('removeBullet', {bulletIDs: [bulletID]})
      return
    }
  }

  function removeBulletStyle(payload, bulletID) {
    emit(
      'removeBulletStyle',
      {bulletIDs: [bulletID, ...payload.bulletIDs], text: payload.text})
  }

  function removeBullet(payload, bulletID) {
    emit('removeBullet', {bulletIDs: [bulletID, ...payload.bulletIDs]})
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
            class="bullet__type"
            v-if="element.style !== 'text'"
            v-html="bulletStyle[element.style].icon"></div>
          <div
            class="bullet__text"
            :class='{"bullet__text--done": bulletStyle[element.style].crossed}'
            :ref="(el) => (bulletElements[element.id] = el)"
            @click="activateEditable($event, element.id)"
            @focus="activateEditMode(element.id)"
            @blur="deactivateEditable($event, element.id)"
            @keydown.enter.exact.prevent="addNewBullet(element.id)"
            @keydown.meta.enter.prevent="toggleBullet(element.id, element.toggled)"
            @keydown.tab.exact.prevent="indentBullet($event, element.id)"
            @keydown.shift.tab.exact.prevent="unindentBullet($event, element.id)"
            @keydown.delete.exact="remove($event, element.id, element.style)"
            >{{ element.text }}</div>
          <div
            class="toggle"
            v-if="element.bullets.length > 0"
            @click="toggleBullet(element.id, element.toggled)"
          >
            <div v-if="element.toggled">&#8211;</div>
            <div v-else>&#x203A;</div>
          </div>
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
            @indentBulletToSibling="indentBulletToSibling($event, element.id)"
            @unindentBulletToParent="unindentBulletToParent($event, element.id)"
            @removeBulletStyle="removeBulletStyle($event, element.id)"
            @removeBullet="removeBullet($event, element.id)"
            />
        </div>
      <cmdbar v-if="page.editModeBulletID.value === element.id" @runCmd="runCmd($event, element.id)"/>
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

  .toggle_ {
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

  .toggle {
    display: flex;
    justify-content: center;
    color:#55555550;
    padding: 0.3rem;
    cursor: pointer;
  }

  .toggle--rotated {
    transform: rotate(180deg);
  }

  /* drag and drop styles */

  .sortable-ghost {
    background-color: #555555 !important;
    overflow: hidden;
  }

  .bullet--placeholder {
    background-color: #55555550 !important;
    border-radius: 0.3rem;
  }
  .bullet--dragged-position {
    height: 5px;
    border-radius: 0.3rem;
    z-index: 100;
    padding: 0;
  }
</style>