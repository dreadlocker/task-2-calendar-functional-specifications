<template>
  <div>
    <div :class="{'fade': isAddEventModalOpen || isShowEventModalOpen}">
      <div class="events-holder-parent">
        <div class="events-holder max-width">
          <div>
            <BaseButton
              :text="addEventBtnText"
              :classes="addEventBtnClasses"
              :func="openModal"
            />
            <BaseButton
              :text="refreshEventBtnText"
              :classes="refreshEventBtnClasses"
              :func="refreshPage"
            />
          </div>

          <div>
            <span class="margin-right">&#128269;</span>
            <input ref="searchInput" @input="searchForEvent" class="input" type="text" placeholder="Search for event">
          </div>
        </div>
      </div>

      <div class="calendar-header max-width">
        <BaseButton
          :text="previousMonthBtnText"
          :classes="previousMonthBtnClasses"
          :func="getPreviousMonthDate"
        />
        <span class="current-date calendar-header-elements-margin-right">{{monthAndYear}}</span>
        <BaseButton
          :text="nextMonthBtnText"
          :classes="nextMonthBtnClasses"
          :func="getNextMonthDate"
        />
        <BaseButton
          :text="todayBtnText"
          :classes="todayBtnClasses"
          :func="getToday"
        />
      </div>

      <div class="calendar-holder max-width">
        <BaseCalendarDay
          v-for="(arr, index) in daysForCurrentMonthArray()"
          :key="index"
          :dayString="index < 7 ? `${daysStringArray[index]}, ` : ''"
          :dayArray="arr"
          @closeShownEventModal="closeShownEventModalMethod"
        />
      </div>
    </div>

    <AddEventModal
      v-if="isAddEventModalOpen"
      @closeAddEventModal="isAddEventModalOpen = false"
    />

    <ShowEventModal
      v-if="isShowEventModalOpen"
      :monthAndYear="monthAndYear"
      :day="calendarDayClicked"
      :keyForLocalStorageCheck="keyFromChild"
      @closeShowEventModal="closeShowEventModalMethod"
    />
  </div>
</template>

<script>
import BaseButton from "./BaseButton.vue";
import BaseCalendarDay from "./BaseCalendarDay.vue";
import AddEventModal from "./AddEventModal.vue";
import ShowEventModal from "./ShowEventModal.vue";
import {fillLocalStorage} from "@/mixins/localStorageHelper.js";

export default {
  name: "MainComponent",
  components: {
    BaseButton,
    BaseCalendarDay,
    AddEventModal,
    ShowEventModal
  },
  computed: {
    monthAndYear() {
      return `${new Date(this.currentYear, this.currentMonthIndex).toLocaleString("default", { month: "long" })} ${this.currentYear}`;
    },
    previousMonthIndex() {
      return this.currentMonthIndex - 1;
    },
    nextMonthIndex() {
      return this.currentMonthIndex + 1;
    },
  },
  data() {
    return {
      currentMonthIndex: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      addEventBtnText: "Add new",
      addEventBtnClasses: "btn events-btn margin-right",
      refreshEventBtnText: "Refresh",
      refreshEventBtnClasses: "btn events-btn",
      previousMonthBtnText: "&#9664;",
      previousMonthBtnClasses: "btn calendar-header-prev-next-btns calendar-header-elements-margin-right",
      nextMonthBtnText: "&#9654;",
      nextMonthBtnClasses: "btn calendar-header-prev-next-btns calendar-header-elements-margin-right",
      todayBtnText: "Today",
      todayBtnClasses: "btn today-btn",
      daysStringArray: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      isAddEventModalOpen: false,
      isShowEventModalOpen: false,
      keyFromChild: "",
      calendarDayClicked: "",
    };
  },
  methods: {
    daysForCurrentMonthArray() {
      let currentMonthDay1Index = new Date(this.currentYear, this.currentMonthIndex).getDay();
      currentMonthDay1Index = currentMonthDay1Index === 0 ? 7 : currentMonthDay1Index;
      const previousMonthName = new Date(this.currentYear, this.previousMonthIndex).toLocaleString("default", { month: "long" });
      const previousMonthYear = this.nextMonthIndex === 1 ? this.currentYear - 1: this.currentYear;
      const previousMonthTotalDays = new Date(this.currentYear, this.currentMonthIndex, 0).getDate();
      const currentMonthName = new Date(this.currentYear, this.currentMonthIndex).toLocaleString("default", { month: "long" });
      const currentMonthYear = this.currentYear;
      const currentMonthTotalDays = new Date(this.currentYear, this.nextMonthIndex, 0).getDate();
      const nextMonthName = new Date(this.currentYear, this.nextMonthIndex).toLocaleString("default", { month: "long" });
      let nextMonthYear = this.nextMonthIndex === 12 ? this.currentYear + 1: this.currentYear;
      const nextMonthTotalDays = new Date(this.currentYear, this.nextMonthIndex + 1, 0).getDate();

      const previousMonthArray = currentMonthDay1Index === 1
        ? []
        : this.generateDaysForMonthArray(`${previousMonthName} ${previousMonthYear}`, previousMonthTotalDays, (currentMonthDay1Index - 1));
      const currentMonthArray = this.generateDaysForMonthArray(`${currentMonthName} ${currentMonthYear}`, currentMonthTotalDays);
      const nextMonthArray = this.generateDaysForMonthArray(`${nextMonthName} ${nextMonthYear}`, nextMonthTotalDays, 0, (42 - currentMonthTotalDays - currentMonthDay1Index + 1));

      return [
        ...previousMonthArray,
        ...currentMonthArray,
        ...nextMonthArray,
      ];
    },
    searchForEvent() {
      // When you search for an event it will highlight it
      const inputValue = this.$refs.searchInput.value.trim();
      const foundEventsArray = document.getElementsByClassName("clickable-day");
      if(!foundEventsArray.length) return;
      if(!inputValue.length) return foundEventsArray.forEach(div => div.classList.remove("border-highlight"));

      const isInputOk = (/^[a-z0-9 ]{1,30}$/gi).test(inputValue);
      if (!isInputOk) return;

      const regexp = new RegExp(inputValue, "gi");
      return foundEventsArray.forEach(div => {
        if (regexp.test(div.children[1].innerHTML)) {
          div.classList.add("border-highlight");
        } else {
          div.classList.remove("border-highlight");
        }
      });
    },
    generateDaysForMonthArray(monthAndYear, totalDaysInMonth, sliceFrom, sliceTo) {
      if (localStorage[monthAndYear]) {
        if (sliceFrom !== undefined && sliceTo) {
          return (Object.entries(JSON.parse(localStorage[monthAndYear])).slice(sliceFrom, sliceTo));
        }
        if (sliceFrom) {
          return (Object.entries(JSON.parse(localStorage[monthAndYear])).slice(-(sliceFrom)));
        }
        return Object.entries(JSON.parse(localStorage[monthAndYear]));
      } else {
        fillLocalStorage(monthAndYear, totalDaysInMonth);
        return this.generateDaysForMonthArray(monthAndYear, totalDaysInMonth, sliceFrom, sliceTo);
      }
    },
    generateCalendarDaysArray() {
      const localStorageKeysArray = Object.keys(localStorage);
      const resultArray = [];
      const currentDayIndex = new Date(this.currentYear, this.currentMonthIndex).getDay();

      if (currentDayIndex > 1) {
        const previousMonthIndex = new Date(this.currentYear, this.currentMonthIndex - 1).getMonth() + 1;
        const previousMonthTotalDays = new Date(this.currentYear, this.currentMonthIndex, 0).getDate();
        let startDayForArrayFill = previousMonthTotalDays - currentDayIndex + 2;
        for (startDayForArrayFill; startDayForArrayFill <= previousMonthTotalDays; startDayForArrayFill++) {
          const keyToCheck = `${this.currentYear}-${previousMonthIndex < 10 ? `0${previousMonthIndex}` : previousMonthIndex}-${startDayForArrayFill}`;
          let currentEventArray = [];
          if(localStorageKeysArray.includes(keyToCheck))
            currentEventArray = localStorage.getItem(keyToCheck).split(",");

          resultArray.push({day: startDayForArrayFill, event: currentEventArray});
        }
      }

      const currentMonthTotalDays = new Date(this.currentYear, this.currentMonthIndex + 1, 0).getDate();
      for (let i = 1; i <= currentMonthTotalDays; i++) {
        const keyToCheck = `${this.currentYear}-${this.currentMonthIndex + 1 < 10 ? `0${this.currentMonthIndex + 1}` : this.currentMonthIndex + 1}-${i < 10 ? `0${i}` : i}`;
        let currentEventArray = [];
        if(localStorageKeysArray.includes(keyToCheck)) {
          currentEventArray = localStorage.getItem(keyToCheck).split(",");
        }
        resultArray.push({day: i, event: currentEventArray});
      }

      if (resultArray.length < 42) {
        const nextMonthIndex = new Date(this.currentYear, this.currentMonthIndex + 1).getMonth() + 1;
        for (let i = 1; resultArray.length < 42; i++) {
          const keyToCheck = `${this.currentYear}-${nextMonthIndex < 10 ? `0${nextMonthIndex}` : nextMonthIndex}-${i < 10 ? `0${i}` : i}`;
          let currentEventArray = [];
          if(localStorageKeysArray.includes(keyToCheck)) {
            currentEventArray = localStorage.getItem(keyToCheck).split(",");
          }
          resultArray.push({day: i, event: currentEventArray});
        }
      }

      return resultArray;
    },
    openModal() {
      return this.isAddEventModalOpen = true;
    },
    refreshPage() {
      return location.reload();
    },
    getPreviousMonthDate() {
      if(!this.currentMonthIndex) {
        this.currentYear -= 1;
        this.currentMonthIndex = 12;
      }
      return this.currentMonthIndex = this.previousMonthIndex;
    },
    getNextMonthDate() {
      const nextMonthIndex = this.nextMonthIndex % 12;
      if (!nextMonthIndex) this.currentYear += 1;
      return this.currentMonthIndex = nextMonthIndex;
    },
    getToday() {
      const now = new Date();
      this.currentYear = now.getFullYear();
      return this.currentMonthIndex = now.getMonth();
    },
    closeShownEventModalMethod(key, calendarDay) {
      this.calendarDayClicked = calendarDay;
      this.keyFromChild = key;
      return this.isShowEventModalOpen = true;
    },
    closeShowEventModalMethod() {
      return this.isShowEventModalOpen = false;
    }
  }
};
</script>
