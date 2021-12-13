<template>
  <table class="table" style="width: 100%;">
  <thead>
    <tr>
      <th style="min-width: 120px;">Date</th>
      <th style="min-width: 130px;">Body Weight</th>
      <th style="min-width: 150px;">Lift</th>
      <th style="min-width: 80px;">Weight</th>
      <th style="min-width: 80px;">Reps</th>
      <th style="min-width: 110px;">1 Rep Max</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="set in sets" :key="set.id">
      <td
        contenteditable="true"
        @input="handleFieldInput"
        @blur="handleFieldBlur"
      >
        {{ set.date }}
      </td>
      <td
        contenteditable="true"
        @input="handleFieldInput"
        @blur="handleFieldBlur"
      >
        {{ set.bodyWeight }}
      </td>
      <td
        contenteditable="true"
        @input="handleFieldInput"
        @blur="handleFieldBlur"
      >
        {{ liftTypes[set.liftType].name }}
      </td>
      <td
        contenteditable="true"
        @input="handleFieldInput"
        @blur="handleFieldBlur"
      >
        {{ set.weight }}
      </td>
      <td
        contenteditable="true"
        @input="handleFieldInput"
        @blur="handleFieldBlur"
      >
        {{ set.reps }}
      </td>
      <td>{{ set.oneRepMax }}</td>
    </tr>
  </tbody>
</table>
</template>

<script>
export default {
  name: 'SetsTable',

  props: ['sets', 'liftTypes'],

  methods: {
    handleFieldInput(event) {
      console.log(event.target.innerText);
    },
    handleFieldBlur(event) {
      console.log('blurrd', event.target.innerText);
    }
  }
}
</script>
