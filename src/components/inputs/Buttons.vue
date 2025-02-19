<template>
  <q-btn
    @click="onClick"
    no-caps
    unelevated
    :class="[
      'rounded-lg',
      button === 'modal' ? 'h-9' : 'h-11',
      textColor,
      color,
    ]"
  >
    <div v-if="label != null" class="flex flex-row items-center">
      <q-icon
        v-if="!right && icon"
        left
        :name="icon"
        :class="['mr-2']"
        :size="iconSize"
      />

      <p
        :class="[
          {
            'text-sm': small,
            'text-base': !small,
            'font-normal': normal,
            'font-medium': !normal,
          },
        ]"
      >
        {{ label }}
      </p>

      <q-icon
        v-if="right && icon"
        right
        :name="icon"
        :class="['ml-1']"
        size="xs"
      />
    </div>

    <div v-else>
      <q-icon v-if="icon != null" :name="icon" size="xs" />
    </div>
  </q-btn>
</template>

<script setup lang="ts">
// Button props with their default values
withDefaults(
  defineProps<{
    color?: string;
    iconSize?: string;
    textColor?: string | null;
    icon?: string | null;
    right?: boolean;
    label: string;
    button?: string;
    small?: boolean;
    normal?: boolean;
  }>(),
  {
    color: "bg-primary-600",
    iconSize: "xs",
    textColor: null,
    icon: null,
    right: false,
    button: "h-11",
    small: false,
    normal: false,
  }
);

const emit = defineEmits<{
  (event: "click"): void;
}>();

const onClick = () => {
  emit("click");
};
</script>
