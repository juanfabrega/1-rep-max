<template>
  <div id="app" class="container">
    <AddSetModal v-if="isAddingSet" @close="handleModalClose" @newSetAdded="fetchInitialData" />
    <main v-if="!isLoading">
      <section class="section pb-2 px-4">
        <div class="is-flex is-justify-content-space-between">
          <h1 class="title is-3 mb-0">1 Rep Max</h1>
          <button class="button is-primary" @click.prevent="handleClickAddSet">+ Add New Set</button>
        </div>
      </section>
      <section class="section has-background-white mt-5 p-5">
        <div v-for="chunk in chunkedMaxes" :key="chunk.key" class="columns">
          <div v-for="max in chunk" :key="max.key" class="column">
            <div class="card">
              <header class="card-header">
                <div class="card-header-title">
                  {{ liftTypes[max.liftType].name }}
                </div>
              </header>
              <div class="card-content">
                <div class="columns">
                  <div class="column is-4">
                    <h3 class="title is-3">{{ calculateOneRepMax(max.weight, max.reps) }}</h3>
                    <p>({{ max.weight }} x {{ max.reps }})</p>
                  </div>
                  <div class="column">
                    <LineChart
                      :chartData="{ datasets: [...dataSets.filter(dataset => dataset.liftTypeId === max.liftType)]}"
                      :options="chartOptions" :styles="{ height: '200px', width: '240px', position: 'relative' }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section has-background-white mt-5" style="overflow-x: scroll;">
        <SetsTable :sets="tableData" :liftTypes="liftTypes" />
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
import { calculateOneRepMax } from '@/helpers/Max.helpers';
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
      chartOptions: {
        legend: false,
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                quarter: 'MMM YY'
              },
              tooltipFormat: 'MMMM D \'YY'
            },
            position: 'bottom',
            ticks: {
              autoskip: true,
              maxTicksLimit: 10,
            },
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
    dataSets() {
      return Object.values(this.liftTypes)
        .sort((a, b) => a.name - b.name)
        .map((liftType, index) => ({
          liftTypeId: liftType.id,
          label: liftType.name,
          backgroundColor: 'transparent',
          borderColor: lineColors[index],
          pointBackgroundColor: lineColors[index],
          tension: 0.3,
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
    },
    maxes() {
      return Object.values(this.liftTypes)
        .map(liftType => (
          Object.values(this.sets)
            .filter(set => set.liftType === liftType.id)
            .sort((setA, setB) => (this.calculateOneRepMax(setB.weight, setB.reps) - this.calculateOneRepMax(setA.weight, setA.reps)))[0]
        ));
    },
    chunkedMaxes() {
      return this.chunk(this.maxes, 2);
    },
  },

  created() {
    this.fetchInitialData();
  },

  methods: {
    calculateOneRepMax,
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
    },
    chunk(arr, len) {
      const chunks = []
      let i = 0
      const n = arr.length

      while (i < n) {
        chunks.push(arr.slice(i, i += len))
      }

      return chunks
    },
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

.title {
  font-weight: 800;
}

.button {
  font-weight: bold;
}

.card-header {
  box-shadow: none;
}

.card-header-title {
  text-transform: capitalize;
  color: hsl(0, 0%, 50%);
}
</style>
