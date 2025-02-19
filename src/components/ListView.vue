<template>
  <div
    v-for="item in items"
    :key="item.externalKey"
    class="my-2 flex rounded-lg border border-gray-iron-200 px-4 py-2 relative"
  >
    <q-separator class="absolute top-1/2 left-4 right-4 w-auto z-10" />
    <div class="grid grid-cols-4 basis-3/4">
      <div v-for="header in headers" :key="header.name">
        <div class="my-4">
          <p class="text-xs text-gray-iron-500 uppercase mb-1">
            {{ header.label }}
          </p>
          <slot :name="header.name" :row="item" :header="header">
            <p class="text-sm text-gray-iron-900">
              {{ item[header.name] }}
            </p>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ListHeaders {
  name: string;
  label: string;
}

interface ListItems {
  [key: string]: any;
}

interface Props {
  headers: ListHeaders[];
  items: ListItems[];
  callback?: (
    event: Event,
    row: ListItems,
    index: number,
    module: string
  ) => void;
}

const props = defineProps<Props>();

const handleCallback = (
  event: Event,
  row: ListItems,
  index: number,
  module: string
) => {
  if (props.callback) {
    console.log("Callback: Clicked");
    props.callback(event, row, index, module);
  }
};
</script>
