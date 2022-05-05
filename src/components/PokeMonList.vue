<script>
import {reactive, ref} from 'vue'
import axios from 'axios'

export default {
  setup() {
    let data = reactive({
      results: null
    });

    axios.get(' https://pokeapi.co/api/v2/pokemon?limit=100&offset=0').then((response) => {
      data.results = response.data.results;
    })

    return {
      data,
    }
  },
}
</script>


<template>
  <li v-for="content in data.results">{{ content.name }}</li>
</template>

