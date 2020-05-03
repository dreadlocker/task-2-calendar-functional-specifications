<template>
  <form class="event-modal">
    <div @click="closeModal" class="modal-close-btn">&#10007;</div>
    <input :class="{'danger': titleError}" ref="title" class="margin-bottom" type="text" placeholder="Title here...">
    <input :class="{'danger': dateError}" ref="date" class="margin-bottom" type="date">
    <textarea :class="{'danger': participantsError}" ref="participants" class="margin-bottom" cols="30" rows="10" placeholder="Participants here..."></textarea>
    <input :class="{'danger': detailsError}" ref="details" class="margin-bottom" type="text" placeholder="Details here...">
    <BaseButton
      :text="btnText"
      :classes="btnClasses"
      :func="saveEvent"
    />
  </form>
</template>

<script>
import {fillLocalStorage} from "@/mixins/localStorageHelper.js";
import BaseButton from "./BaseButton.vue";

export default {
  name: "AddEventModal",
  components: {
    BaseButton
  },
  data() {
    return {
      btnText: "Save Event",
      btnClasses: "save-event-btn btn events-btn",
      titleError: false,
      dateError: false,
      participantsError: false,
      detailsError: false,
    };
  },
  methods: {
    closeModal() {
      return this.$emit("closeAddEventModal");
    },
    saveEvent() {
      const titleValue = this.$refs.title.value.trim();
      if(!((/^[A-Z]{1}[a-z0-9\s+]{1,48}[a-z0-9]{1}$/g).test(titleValue))) {
        this.titleError = true;
        this.$refs.title.focus();
        return alert("Title have to start with a capital letter, followed by lowercase letters or numbers, length between 3 and 50 characters.");
      } else {
        this.titleError = false;
      }
        
      const dateValue = this.$refs.date.value.trim();
      if(!dateValue.length) {
        this.dateError = true;
        this.$refs.date.focus();
        return alert("Wrong date.");
      } else {
        this.dateError = false;
      }
        
      const participantsValue = this.$refs.participants.value.trim();
      if(!((/([A-Za-z0-9]{1}[a-zA-Z0-9]+)\s*,*\s*/gm).test(participantsValue))) {
        this.participantsError = true;
        this.$refs.participants.focus();
        return alert("Participants needs to be separated by comma and have at least 2 characters.");
      } else {
        this.participantsError = false;
      }
        
      const detailsValue = this.$refs.details.value.trim();
      if(!((/[A-Za-z0-9\s*,*.*]{1,100}$/g).test(detailsValue))) {
        this.detailsError = true;
        this.$refs.details.focus();
        return alert("Details have to have between 1 and 100 characters.");
      } else {
        this.detailsError = false;
      }
      
      const dateFromDateValue = new Date(dateValue);
      const day = dateFromDateValue.getDate();
      const monthIndex = dateFromDateValue.getMonth();
      const year = dateFromDateValue.getFullYear();
      const monthName = new Date(year, monthIndex).toLocaleString("default", { month: "long" });
      const localStorageKey = `${monthName} ${year}`;
      const monthObjFromLocalStorage = JSON.parse(localStorage.getItem(localStorageKey));
      if (!monthObjFromLocalStorage) {
        const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        new Promise(function(resolve, reject) {
          resolve(fillLocalStorage(localStorageKey, totalDaysInMonth));
          reject(new Error("Something is wrong."));
        }).then(() => {
          const monthObjFromLocalStorage = JSON.parse(localStorage.getItem(localStorageKey));
          const thisDayEventObj = monthObjFromLocalStorage[day];
          const dayMonthYear = monthObjFromLocalStorage[day]["dayMonthYear"];
          const objValuesArray = [titleValue, participantsValue, detailsValue, dayMonthYear];
          Object.keys(thisDayEventObj).forEach((key, index) => thisDayEventObj[key] = objValuesArray[index]);
          localStorage.setItem(localStorageKey, JSON.stringify(monthObjFromLocalStorage));
          return this.closeModal();
        });
      } else {
        const thisDayEventObj = monthObjFromLocalStorage[day];
        const dayMonthYear = monthObjFromLocalStorage[day]["dayMonthYear"];
        const objValuesArray = [titleValue, participantsValue, detailsValue, dayMonthYear];
        Object.keys(thisDayEventObj).forEach((key, index) => thisDayEventObj[key] = objValuesArray[index]);
        localStorage.setItem(localStorageKey, JSON.stringify(monthObjFromLocalStorage));
        return this.closeModal();
      }
    }
  },
  mounted() {
    return this.$refs.title.focus();
  }
};
</script>
