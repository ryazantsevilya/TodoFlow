<template>
  <p
    ref="editable"
    contenteditable
    v-on="listeners"
  ></p>
</template>

<script>
export default {
  name: 'Task',

  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    listeners () {
      return { ...this.$listeners, input: this.onInput }
    }
  },
  mounted () {
    this.$refs.editable.innerText = this.value
  },
  methods: {
    onInput (e) {
      this.$emit('input', e.target.innerText)
    }
  }
}
</script>

<style type="text/css">

</style>