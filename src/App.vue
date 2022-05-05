<template>
  <Suspense>
    <template #default>
      <PokeManList />
    </template>
    <template #fallback>
      Loading ...
    </template>
  </Suspense>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
import PokeMonList from "./components/PokeMonList.vue";
</script>

<style>
</style>
