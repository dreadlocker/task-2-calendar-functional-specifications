<template>
  <div class="event-modal">
    <div @click="closeModal" class="modal-close-btn">&#10007;</div>
    <div class="bold">Title:</div>
    <div class="separate-rows">{{title}}</div>
    <div class="bold">Participants:</div>
    <div class="separate-rows">{{participants}}</div>
    <div class="bold">Description:</div>
    <div class="separate-rows">{{description}}</div>
    <BaseButton
      :text="removeEvent"
      :classes="removeEventClasses"
      :func="removeEventMehod"
    />
  </div>
</template>

<script>
import BaseButton from "./BaseButton.vue";

export default {
  name: "ShowEventModal",
  components: {
    BaseButton
  },
  computed: {
    title() {
      return JSON.parse(localStorage[this.monthAndYear])[this.day].title;
    },
    participants() {
      return JSON.parse(localStorage[this.monthAndYear])[this.day].participants;
    },
    description() {
      return JSON.parse(localStorage[this.monthAndYear])[this.day].description;
    }
  },
  data() {
    return {
      removeEvent: "Remove",
      removeEventClasses: "save-event-btn btn events-btn",
    };
  },
  props: {
    monthAndYear: {
      type: String,
      required: true
    },
    day: {
      type: String,
      required: true
    },
  },
  methods: {
    closeModal() {
      return this.$emit("closeShowEventModal");
    },
    removeEventMehod() {
      const monthAndYearObj = JSON.parse(localStorage[this.monthAndYear]);
      monthAndYearObj[this.day] = {title: "", participants: "", description: ""};
      localStorage.setItem(this.monthAndYear, JSON.stringify(monthAndYearObj));
      return this.closeModal();
    }
  },
};
</script>
