<template>
  <div
    @click="dayArray[1].title.length ? passKeyToParent(): null"
    :class="{'clickable-day': dayArray[1].title.length}"
    :data-day="dayArray[1].dayMonthYear"
    class="day-holder"
  >
    <div class="day-header">{{dayString}}{{dayArray[0]}}</div>
    <div v-if="dayArray[1].title" class="event-header">{{eventTitle}}</div>
    <div v-if="dayArray[1].description" class="event-info">{{eventDescription}}</div>
  </div>
</template>

<script>
export default {
  name: "BaseCalendarDay",
  props: {
    dayString: {
      type: String,
      required: true
    },
    dayArray: {
      type: Array,
      required: true
    },
  },
  computed: {
    eventTitle() {
      if(!this.dayArray[1].title.length) return;
      const eventTitle = this.dayArray[1].title;
      return eventTitle.length < 22 ? eventTitle : `${eventTitle.slice(0, 22)}...`;
    },
    eventDescription() {
      if(!this.dayArray[1].description.length) return;
      const eventDescription = this.dayArray[1].description;
      return eventDescription.length < 22 ? eventDescription : `${eventDescription.slice(0, 26)}...`;
    }
  },
  methods: {
    passKeyToParent() {
      return this.$emit("closeShownEventModal", this.keyForLocalStorageCheck, this.dayArray[0]);
    }
  },
};
</script>
