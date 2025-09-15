<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

const breadcrumbItems = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  const items = [{ label: "Home", href: "/" }];
  segments.forEach((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    items.push({
      label: seg.charAt(0).toUpperCase() + seg.slice(1),
      href: idx < segments.length - 1 ? href : null, // dernier segment = page actuelle
    });
  });
  return items;
});
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger class="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList class="flex items-center gap-1">
            <template v-for="(item, index) in breadcrumbItems" :key="index">
              <BreadcrumbItem>
                <BreadcrumbLink v-if="item.href" :href="item.href">
                  {{ item.label }}
                </BreadcrumbLink>
                <BreadcrumbPage v-else>{{ item.label }}</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator v-if="index < breadcrumbItems.length - 1" />
            </template>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main class="w-11/12 mx-auto">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
