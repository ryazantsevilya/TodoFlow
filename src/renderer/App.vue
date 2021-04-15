<template>
  <div id="app">
    <div class="movebar"></div>
    <div class="flow-bar">
        <div v-for="(flow, index) in flows" 
          :key="flow.id" 
          class="flow-bar__item" 
          :class="{'flow-bar__item--selected' : index == selectedFlowIndex}" 
          @click="selectedFlowIndex = index">
        </div>
    </div>
    <div class="todo-item-list">
      <div v-for="(item, index) in todo" :key="index">
        <div class="todo-item" v-if="item.flowId == flows[selectedFlowIndex].id"> 
          <div @click="item.ready = !item.ready" class="ready-checked" :class="{'ready-checked--active': item.ready}"></div>
          <textarea-autosize
            class="input-task"
            :class="{'input-task--ready': item.ready}"
            ref="myTextarea"
            v-model="item.text"
            rows="1"
            :min-height="50"
          />
          <div class="button-delete" @click="deleteTodoItem(index)"></div>
        </div>
      </div>
      <div @click="addTodoItem()" class="button"></div>
    </div>
  </div>
</template>

<script>
export default {
  created: function () {
    let todos = this.$userStore.get('todo')
    let flow = this.$userStore.get('flows')

    if (flow) {
      this.flows = flow
      this.selectedFlowIndex = this.flows.length - 1
    } else {
      this.addFlow()
    }

    if (todos) {
      this.todo = todos
    } else {
      this.addTodoItem()
    }
  },
  mounted () {
    setInterval(() => this.saveItems(), 20000)

    this._keyListener = function (e) {
      if (e.key === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        this.selectNextFlow()
      }
      if (e.key === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        this.selectPrevFlow()
      }
      if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        this.addTodoItem()
      }
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        this.saveItems()
      }

      if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        this.deleteSekectFlow()
        this.selectPrevFlow()
      }
    }

    document.addEventListener('keydown', this._keyListener.bind(this))
  },
  data: function () {
    return {
      todo: [],
      flows: [],
      selectedFlowIndex: 0
    }
  },
  methods: {
    saveItems () {
      this.$userStore.set('todo', this.todo)
      this.$userStore.set('flows', this.flows)
    },
    addFlow: function () {
      let nextFlowId = 1
      if (this.flows) {
        nextFlowId = Math.max(...this.flows.map(o => o.id), 0) + 1
      }
      let flowItem = {
        id: nextFlowId,
        name: '',
        created: new Date()
      }
      this.flows.push(flowItem)
    },
    deleteSekectFlow: function () {
      if (this.flows.length > 1) {
        this.deleteTodoItemsToFLowIndex(this.selectedFlowIndex)
        this.flows.splice(this.selectedFlowIndex, 1)
      }
    },
    deleteTodoItemsToFLowIndex: function (flowIndex) {
      let flow = this.flows[flowIndex]
      this.todo.forEach((index, element) => {
        if (element.flowId === flow.id) {
          this.deleteTodoItem(index)
        }
      })
    },
    addTodoItem: function (text = '') {
      let todoItem = {
        text: text,
        ready: false,
        created: new Date(),
        flowId: this.flows[this.selectedFlowIndex].id
      }
      this.todo.push(todoItem)
    },
    deleteTodoItem: function (index) {
      this.todo.splice(index, 1)
    },
    selectNextFlow: function () {
      if (this.flows.length <= 1) {
        this.addFlow()
      }
      if (this.flows.length !== this.selectedFlowIndex + 1) {
        this.selectedFlowIndex = this.selectedFlowIndex + 1
      } else {
        this.addFlow()
      }
    },
    selectPrevFlow: function () {
      if (this.flows.length <= 1) {
        return
      }
      if (this.selectedFlowIndex - 1 !== -1) {
        this.selectedFlowIndex = this.selectedFlowIndex - 1
      }
    }
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this._keyListener)
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: #24283b;
  box-sizing: border-box;
}

/* Works on Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: #1e1f29;
}

*::-webkit-scrollbar-thumb {
  background-color: rgb(45, 51, 74);
  border-radius: 20px;
}

.movebar {
  -webkit-user-select: none;
  -webkit-app-region: drag;
  width: 100%;
  height: 20px;
  background-color: #1e1f29;
  position: fixed;
  top: 0;
  z-index: 2;
}

.flow-bar {
  width: 100%;
  height: 20px;
  box-shadow: 0 0 2px rgba(0,0,0,0.2);
  display: flex;
  position: fixed;
  top: 20px;
  z-index: 2;
  background-color: #24283b
}

.flow-bar__item {
  cursor: pointer;
  width: 50px;
  height: 100%;
  border-right: 1px solid rgb(28, 31, 48);
  background-color: rgba(27,30,46, 0.5);
}

.flow-bar__item:hover {
  background-color: rgb(27,30,46);
}

.flow-bar__item--selected {
  border-bottom: 1px solid rgb(59, 85, 154);
}

.input-task {
  width: 100%;
  background-color: #1b1e2e;
  padding: 10px;
  margin-bottom: 1px;
  overflow:hidden;
  font-size: 24px;
  border-color:  #1b1e2e;
  color: #607cbc;
  font-family: 'Source Sans Pro', sans-serif;
}

.input-task--ready {
  border: 1;
  border-color: rgba(34, 220, 175, 0.18);
  border-style: solid;
}

.input-task:focus {
  border: 0.5px solid rgb(49, 55, 79); /* Параметры рамки */
}

textarea:focus, input:focus{
    outline: none;
}

.button {
  width: 100%;
  height: 20px;
  background-color: rgba(27,30,46, 0.5);
  cursor: pointer;
}

.button:hover {
  background-color: rgb(27,30,46);
}

.butto-delete {
  background-color: black;
  opacity: 0.3;
}

.todo-item-list {
  margin-top: 45px;
}

.todo-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: solid;
  border: 2px;
  border-color: #2600ff;
  margin: 5px;
}

.ready-checked {
  width: 25px;
  height: 25px;
  border: 1px;
  border-radius: 50%;
  border-color: #586072;
  border-style: solid;
  margin: 0 7px;
  box-shadow: 0 0 2px rgba(0,0,0,0.2);
  opacity: 0.5;
}

.ready-checked--active {
  background-color: rgba(20, 236, 107, 0.77);
  opacity: 1;
  border-color:rgba(34, 220, 175, 0.18);
}

.ready-checked:hover {
  cursor: pointer;
}

.button-delete {
  width: 25px;
  height: 25px;
  background-color: #e44040;
  border-radius: 10%;
  margin: 0 7px;
  box-shadow: 0 0 2px rgba(0,0,0,0.2);
  opacity: 0.7;
}
.button-delete:hover {
  opacity: 1;
}
</style>
