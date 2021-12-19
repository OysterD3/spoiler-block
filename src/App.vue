<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Option } from "./@types";
import { v4 as uuid } from "uuid";

const term = ref("");
const options = ref<Option[]>([]);

const handleAdd = () => {
  if (term.value !== "") {
    if (options.value.findIndex((v) => v.term === term.value) !== -1) {
      term.value = "";
      return;
    }
    const opts: Option[] = [
      {
        id: uuid(),
        term: term.value,
        createdAt: new Date().toISOString(),
      },
      ...options.value,
    ];
    options.value = opts;
    term.value = "";
    chrome.storage.sync.set({ options: JSON.stringify(opts) }, () => {});
  }
};

const clearAll = () => {
  chrome.storage.sync.clear();
  options.value = [];
};

const handleDelete = (id: string) => {
  const idx = options.value.findIndex((v) => v.id === id);
  if (idx > -1) {
    options.value.splice(idx, 1);
    chrome.storage.sync.set(
      { options: JSON.stringify(options.value) },
      () => {},
    );
  }
};

onMounted(() => {
  chrome.storage.sync.get(null, (res: { options?: string }) => {
    if (res.options) {
      options.value = JSON.parse(res.options) as Option[];
    }
  });
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">Spoiler Block</h1>
    <label id="listbox-label" class="block text-sm font-medium text-gray-700">
      Add new term to block
    </label>
    <div class="mt-1 relative flex items-center">
      <input
        id="search"
        v-model="term"
        type="text"
        autocomplete="off"
        name="search"
        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
        @keypress.enter="handleAdd"
      />
      <div
        class="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 cursor-pointer"
        @click="handleAdd"
      >
        <kbd
          class="inline-flex items-center border border-gray-200 rounded px-2 text-sm font-sans font-medium text-gray-400"
        >
          Add
        </kbd>
      </div>
    </div>
    <div class="mt-5">
      <div class="flex items-center mb-2">
        <h2 class="text-lg flex-1">Existing Terms</h2>
        <div
          class="px-2 py-1 rounded-md bg-red-600 text-white font-medium cursor-pointer"
          @click="clearAll"
        >
          Clear all
        </div>
      </div>
      <div class="space-y-2">
        <div
          v-for="opt in options"
          :key="opt.id"
          class="px-4 py-2 items-center border border-gray-300 rounded flex"
        >
          <span class="flex-1">{{ opt.term }}</span>
          <svg
            class="w-5 h-5 cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            @click="handleDelete(opt.id)"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
