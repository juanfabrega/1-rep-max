<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <form @submit.prevent="handleSubmit">
        <header class="modal-card-head">
          <p class="modal-card-title">
            Add New Set
          </p>
          <button class="delete" aria-label="close" @click="handleClickClose"></button>
        </header>
        <section v-if="!isLoading" class="modal-card-body">
          <h3 class="title is-4 has-text-centered"><span style="font-weight: normal;">Preview 1RM:</span> {{ oneRepMaxPreview }}</h3>
          <div class="field">
            <label class="label">Lift</label>
            <div class="control">
              <div class="select">
                <select v-model="form.fields.liftType">
                  <option v-for="liftType in Object.values(liftTypes)" :key="liftType.id" :value="liftType.id">
                    {{ liftType.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Weight</label>
            <div class="control">
              <input v-model="form.fields.weight" class="input" type="number" placeholder="">
            </div>
          </div>
          <div class="field">
            <label class="label">Reps</label>
            <div class="control">
              <input v-model="form.fields.reps" class="input" type="number" placeholder="">
            </div>
          </div>
          <div class="field">
            <label class="label">Your Body Weight</label>
            <div class="control">
              <input v-model="form.fields.bodyWeight" class="input" type="number" placeholder="">
            </div>
          </div>
          <div class="field">
            <label class="label">Date</label>
            <div class="control">
              <input v-model="form.fields.date" class="input" type="date" placeholder="">
            </div>
          </div>
        </section>
        <section v-else>
          Loading...
        </section>
        <footer class="modal-card-foot">
          <button
            :class="[
              'button',
              'is-success',
              { 'is-loading': form.isSubmissionInProgress },
            ]"
            type="submit"
          >
              Save changes
            </button>
          <button class="button" @click="handleClickClose">Cancel</button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script>
import { getCollection, createNewDoc } from '@/services/Database.service';
import { dictionaryFromDocumentArray } from '@/helpers/Data.helpers';
import { calculateOneRepMax } from '@/helpers/Max.helpers';

export default {
  name: 'AddSetModal',

  data() {
    return {
      isLoading: true,
      liftTypes: null,
      form: {
        isSubmissionInProgress: false,
        fields: {
          liftType: null,
          weight: null,
          reps: null,
          bodyWeight: null,
          date: null,
        },
      },
    };
  },

  computed: {
    oneRepMaxPreview() {
      const { weight, reps } = this.form.fields;
      let max = 'N/A';
      if (weight && reps) {
        max = this.calculateOneRepMax(Number(weight), Number(reps));
      }

      return max;
    },
  },

  created() {
    this.fetchInitialData();
  },

  methods: {
    calculateOneRepMax,
    async fetchInitialData() {
      this.isLoading = true;

      const { docs } = await getCollection('lift-types');
      this.liftTypes = dictionaryFromDocumentArray(docs);

      this.isLoading = false;
    },
    handleClickClose() {
      this.$emit('close');
    },
    async handleSubmit() {
      this.form.isSubmissionInProgress = true;

      const {
        liftType,
        weight,
        reps,
        bodyWeight,
        date,
      } = this.form.fields;

      try {
        await createNewDoc('sets', {
          liftType,
          weight,
          reps,
          bodyWeight,
          date,
        });
        this.form.isSubmissionInProgress = false;
        this.$emit('newSetAdded');
        this.$emit('close');
      } catch (err) {
        console.error(err);
        this.form.isSubmissionInProgress = false;
      }
    },
  }
}
</script>

<style>
.modal-card-body {
  max-height: 400px;
}
</style>
