<template>
      <div class="card">
            <slot />
      </div>
</template>
<script>
export default {
      name: "CardView"
}
</script>
<style scoped>
.card {
      padding:  0.8rem 1rem 0.8rem 1rem;
      border-radius: 0.7rem;
      width: 38vh;
      box-shadow: 0 2px 4px 0 rgb(15, 15, 15);
      margin-bottom: 0.8rem;
      cursor: pointer;
}
</style>