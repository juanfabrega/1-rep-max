<template>
  <table class="table" style="width:">
  <thead>
    <tr>
      <th>Date</th>
      <th>Body Weight</th>
      <th>Lift</th>
      <th>Weight</th>
      <th>Reps</th>
      <th>1 Rep Max</th>
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
