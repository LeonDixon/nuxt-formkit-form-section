<script setup lang="ts">
import type { FormKitSchemaDefinition } from '@formkit/core';
import { FormKit, FormKitSchema } from '@formkit/vue';

const props = defineProps<{
  name?: string
  label?: string
  loadLocalStorageNodes?: boolean
}>()

const coverPageFormSection: FormKitSchemaDefinition = {
  $formkit: 'form-section',
  name: 'coverPage',
  id: 'coverPage',
  loadLocalStorageNodes: true,
  children: [
    '$: $fns.getSectionNode("level-1").value',
    '$fns.getSectionNode("level-2").value',
    {
      $formkit: 'togglebuttons',
      name: 'async-togglebuttons',
      label: 'async togglebuttons',
    },
    {
      $formkit: 'dropdown',
      name: 'async-dropdown',
      label: 'async dropdown',
      options: ['test1', 'test2']
    }
  ]
}

const demandsFormSection: FormKitSchemaDefinition = {
  $formkit: 'form-section',
  name: 'demands',
  id: 'demands',
  loadLocalStorageNodes: true,
  children: [
    {
      $formkit: 'text',
      name: 'level-1',
      label: 'level 1',
      id: 'level-1',
    },
    {
      $formkit: 'group',
      name: 'test-group',
      children: [
        {
          $formkit: 'text',
          name: 'level-2',
          label: 'level 2',
          id: 'level-2',
        },
      ]
    }
  ]
}

onMounted(() => {
  console.log(getNode('demands'))
  console.log(getNode('coverPage'))

  setTimeout(() => {
    console.log(getNode('level-1'))

  }, 10)
})

const schema = props.name === 'demands' ? demandsFormSection : coverPageFormSection
</script>

<template>
  <FormKit type="form" name="test-form" id="test-form" use-local-storage>
    <FormKitSchema :schema="schema" />
  </FormKit>
</template>

<style lang="scss" scoped></style>