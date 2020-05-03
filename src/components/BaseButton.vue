<template>
  <button @click.prevent="func" :class="classes" v-html="text"></button>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    text: {
      type: String,
      required: true
    },
    classes: {
      type: String,
      required: true
    },
    func: {
      type: Function,
      required: true
    },
  },
};
</script>
