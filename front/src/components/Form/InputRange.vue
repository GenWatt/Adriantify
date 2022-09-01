<template>
  <input id="input-range" type="range" />
</template>

<style scoped>
#input-range {
  -webkit-appearance: none;
  background-color: transparent;
}

#input-range:focus {
  outline: none;
}

#input-range::-ms-track {
  width: 100%;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}

#input-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 0.9rem;
  width: 0.9rem;
  border-radius: 50%;
  background-color: #15b7b9;
  cursor: pointer;
  margin-top: -0.45rem;
}

#input-range::-moz-range-thumb {
  height: 0.9rem;
  width: 0.9rem;
  border-radius: 50%;
  background-color: #15b7b9;
  cursor: pointer;
}

#input-range::-webkit-slider-runnable-track {
  height: 0.2rem;
  cursor: pointer;
  background-color: #15b7b9;
  border-radius: 0.3rem;
  border: 0.2rem solid #299293;
}

#input-range::-moz-range-track {
  height: 0.2rem;
  cursor: pointer;
  background-color: #15b7b9;
  border-radius: 0.3rem;
  border: 0.1rem solid #299293;
}
</style>
