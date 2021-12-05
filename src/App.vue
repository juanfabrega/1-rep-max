<template>
  <div id="app" class="container">
    <AddSetModal v-if="isAddingSet" @close="handleModalClose" />
    <main v-if="!isLoading">
      <section class="section pb-2 px-0">
        <div class="is-flex is-justify-content-space-between">
          <h2 class="title is-2 mb-0">1 Rep Max</h2>
          <button class="button is-primary" @click.prevent="handleClickAddSet">+ Add New Set</button>
        </div>
      </section>
      <section class="section has-background-white mt-5">
        <SetsTable :sets="tableData" :liftTypes="liftTypes" />
      </section>
      <section class="section has-background-white mt-5">
        <div class="columns">
          <div v-for="max in maxes" :key="max.key" class="column">
            <div class="card">
              <header class="card-header">
                <div class="card-header-title">
                  {{ max.lift }}
                </div>
              </header>
              <div class="card-content">
                <h3 class="title is-3">{{ calculateOneRepMax(max.weight, max.reps) }}</h3>
                <p>({{ max.weight }} x {{ max.reps }})</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section has-background-white mt-5">
        <LineChart :chartData="chartData" :options="chartOptions" />
      </section>
    </main>
    <main v-else>
      <div>Loading...</div>
    </main>
  </div>
</template>

<script>
import moment from 'moment';
import { getCollection } from '@/services/Database.service';
import { dictionaryFromDocumentArray } from '@/helpers/Data.helpers';
import AddSetModal from '@/components/AddSetModal.vue';
import LineChart from '@/components/LineChart';
import SetsTable from '@/components/SetsTable';


const lineColors = [
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(75, 192, 192)',
  'rgb(255, 205, 86)',
  'rgb(255, 159, 64)',
  'rgb(231,233,237)',
];

export default {
  name: 'App',

  components: {
    AddSetModal,
    LineChart,
    SetsTable,
  },

  data() {
    return {
      isLoading: true,
      isAddingSet: false,
      liftTypes: {},
      sets: {},
      maxes: [],
      chartOptions: {
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                quarter: 'MMM YY'
              },
              tooltipFormat: 'MMMM D \'YY'
            },
            position: 'bottom'
          }]
        },
        hover: {
          mode: 'nearest', // only hovers items under the mouse
          intersect: false
        },
        responsive: true,
        maintainAspectRatio: false
      },
    };
  },

  computed: {
    chartData() {
      return {
        datasets: [...this.dataSets],
      };
    },
    dataSets() {
      return Object.values(this.liftTypes)
        .sort((a, b) => a.name - b.name)
        .map((liftType, index) => ({
          label: liftType.name,
          backgroundColor: 'transparent',
          borderColor: lineColors[index],
          pointBackgroundColor: lineColors[index],
          pointRadius: 4,
          data: Object.values(this.sets)
            .sort((a, b) => moment(a.date) - moment(b.date))
            .filter(set => set.liftType === liftType.id).map(set => ({ x: moment(set.date), y: this.calculateOneRepMax(set.weight, set.reps) })),
        }));
    },
    tableData() {
      return Object.values(this.sets)
        .sort((a, b) => moment(a.date) - moment(b.date))
        .map(set => ({ ...set, oneRepMax: this.calculateOneRepMax(set.weight, set.reps) }));
    }
  },

  created() {
    this.fetchInitialData();
  },

  methods: {
    calculateOneRepMax(weight, reps) {
      return Math.floor(weight / (1.0278 - (0.0278 * reps)));
    },
    async fetchInitialData() {
      this.isLoading = true;

      const { docs: liftTypeDocs } = await getCollection('lift-types');
      const { docs: setsDocs } = await getCollection('sets');

      this.liftTypes = dictionaryFromDocumentArray(liftTypeDocs);
      this.sets = dictionaryFromDocumentArray(setsDocs);

      this.isLoading = false;
    },
    filterSetsByLiftType(sets, liftTypes, liftTypeName) {
      const [liftType] = Object.values(liftTypes).filter(type => type.name === liftTypeName);
      return Object.values(sets).filter(set => set.liftType === liftType.id);
    },
    handleClickAddSet() {
      this.isAddingSet = true;
    },
    handleModalClose() {
      this.isAddingSet = false;
    }
  },
}
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css";

body, html {
  margin: 0;
  padding: 0;
  background-color: hsl(0, 0%, 96%);
}
</style>
