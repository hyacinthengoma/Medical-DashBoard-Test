<script setup>
import { ref, computed, watch } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  FlexRender,
} from '@tanstack/vue-table'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table'

const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, default: () => [] },
  initialPageSize: { type: Number, default: 10 },
  pageSizeOptions: { type: Array, default: () => [5, 10, 20, 50] },
  placeholder: { type: String, default: 'Rechercher...' },
})

const sorting = ref([])
const globalFilter = ref('')
const pagination = ref({
  pageIndex: 0,
  pageSize: props.initialPageSize,
})

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  state: {
    get sorting() {
      return sorting.value
    },
    get globalFilter() {
      return globalFilter.value
    },
    get pagination() {
      return pagination.value
    },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  onGlobalFilterChange: (updater) => {
    globalFilter.value =
      typeof updater === 'function' ? updater(globalFilter.value) : updater
  },
  onPaginationChange: (updater) => {
    pagination.value =
      typeof updater === 'function' ? updater(pagination.value) : updater
  },

  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

watch(
  () => props.initialPageSize,
  (val) => {
    pagination.value.pageSize = val
    pagination.value.pageIndex = 0
  }
)

const pageCount = computed(() => table.getPageCount())
const canPrev = computed(() => table.getCanPreviousPage())
const canNext = computed(() => table.getCanNextPage())

const onChangePageSize = (value) => {
  const size = Number(value)
  table.setPageSize(size)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <Input
        class="max-w-sm"
        :placeholder="placeholder"
        v-model="globalFilter"
      />
      <div class="ml-auto flex items-center gap-2">
        <Select :modelValue="String(pagination.pageSize)" @update:modelValue="onChangePageSize">
          <SelectTrigger class="w-[140px]">
            <SelectValue placeholder="Taille de page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="opt in pageSizeOptions"
              :key="opt"
              :value="String(opt)"
            >
              {{ opt }} par page
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="hg in table.getHeaderGroups()" :key="hg.id">
            <TableHead
              v-for="header in hg.headers"
              :key="header.id"
              class="whitespace-nowrap"
            >
              <div
                v-if="!header.isPlaceholder"
                class="flex select-none items-center gap-2 cursor-pointer"
                @click="header.column.getToggleSortingHandler()?.($event)"
              >
                <span>
                  <FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                </span>
                <span
                  v-if="header.column.getIsSorted() === 'asc'"
                  class="text-muted-foreground text-xs"
                >
                  ▲
                </span>
                <span
                  v-else-if="header.column.getIsSorted() === 'desc'"
                  class="text-muted-foreground text-xs"
                >
                  ▼
                </span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id" @click="$emit('row-click', row.original)" style="cursor:pointer;">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell
                :colspan="table.getAllColumns().length"
                class="h-24 text-center"
              >
                Aucun résultat.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-between">
      <div class="text-sm text-muted-foreground">
        Page {{ table.getState().pagination.pageIndex + 1 }} sur {{ table.getPageCount() }}
        • {{ table.getFilteredRowModel().rows.length }} éléments
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
          Précédent
        </Button>
        <Button variant="outline" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
          Suivant
        </Button>
      </div>
    </div>
  </div>
</template>
