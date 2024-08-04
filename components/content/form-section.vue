<script setup lang="ts">
import type { FormKitSchemaDefinition } from '@formkit/core';
import { FormKit, FormKitSchema } from '@formkit/vue';

const props = defineProps<{
  name?: string
  label?: string
  loadLocalStorageNodes?: boolean
}>()

const schemas: Record<string, FormKitSchemaDefinition> = {
  demands: [
    {
      $formkit: 'text',
      name: 'loser-firstname',
      label: 'Loser Firstname',
      id: 'loser-firstname',
    },
    {
      $formkit: 'text',
      name: 'loser-surename',
      label: 'Loser Surname',
      id: 'loser-surename',
    },
    {
      $formkit: 'group',
      name: 'test-group',
      children: [
        {
          $formkit: 'text',
          name: 'group-loser-firstname',
          label: 'group Loser Firstname',
          id: 'group-loser-firstname',
        },
        {
          $formkit: 'text',
          name: 'group-loser-surename',
          label: 'group Loser Surname',
          id: 'group-loser-surename',
        },
        {
          $formkit: 'number',
          name: 'test-number',
          id: 'test-number',
          number: "integer"
        }
      ]
    }
  ],
  coverPage: [
    {
      if: '$get("test-number").value === 0',
      $formkit: 'text',
      name: 'if-test',
      label: 'test the if works'
    }
  ]
}

</script>

<template>
  <FormKit type="form" name="test-form" use-local-storage>
    <FormKit type="form-section" :name :label :loadLocalStorageNodes>
      <FormKitSchema :schema="schemas[props.name]" />
    </FormKit>
  </FormKit>
</template>

<style lang="scss" scoped></style>