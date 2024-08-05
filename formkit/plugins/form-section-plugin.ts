import { createNode, type FormKitNode, type FormKitPlugin, type FormKitTypeDefinition } from "@formkit/core";
import { createSection, wrapper, label, outer, inner, icon, prefix, suffix, help, messages, message, type FormKitSchemaExtendableSection, type FormKitInputs, group } from '@formkit/inputs'

declare module '@formkit/inputs' {
  interface FormKitInputProps<Props extends FormKitInputs<Props>> {
    // This key and the `type` should match:
    'form-section': {
      // Define your input `type`:
      type: 'form-section',
      // Define a required prop
      loadLocalStorageNodes: boolean
      // Define the value type, this should always be a optional!
      value?: object
    }
  }
}

const callbacksToDestroyNodes: (() => void)[] = []

export function formSectionPlugin(options: {
  localStoragePrefix?: string
} = {}): FormKitPlugin {
  const nuxtContentMultiStepPlugin = (node: FormKitNode) => {
    if (node.props.type !== 'form-section')
      return

    const parentNode = node.parent

    if (!node.context || !parentNode?.context) return
    if (node.props.loadLocalStorageNodes && window) {
      const localStorageId = options.localStoragePrefix ?? 'formkit'
      const localStorageData = localStorage.getItem(`${localStorageId}-${parentNode?.name}`)
      if (localStorageData) {
        const { data } = JSON.parse(localStorageData)
        const formNode = createNode({
          type: 'group',
          name: parentNode.context!.id,
          props: {
            useLocalStorage: true
          }
        })
        getNodesFromGroup(data, formNode)
        console.log('hit', data)
      }
    }
    node.on('created', () => {

    })

    node.on('destroying', () => {
      callbacksToDestroyNodes.forEach((callback) => callback())
    })
  }

  nuxtContentMultiStepPlugin.library = (node: FormKitNode) => {
    // switch (node.props.type) {
    // case 'nuxt-content-multi-step':
    return node.define(formSectionStep)
  }

  return nuxtContentMultiStepPlugin
}

function getNodesFromGroup(node: object, parent: FormKitNode) {
  console.log(node)
  const childrenNodesIds = Object.keys(node)
  for (const childNodeId of childrenNodesIds) {
    if (!getNode(childNodeId)) {

      const childNodeValue = node[childNodeId as keyof typeof node]
      console.log(childNodeValue, typeof childNodeValue)
      if (typeof childNodeValue === 'number' || typeof childNodeValue === 'string') {
        const newNode = createNode({
          type: 'input',
          name: childNodeId,
          value: childNodeValue
        })

        parent.add(newNode)

        callbacksToDestroyNodes.push(() => newNode.destroy())

        console.log(newNode)
      }
      else if (Array.isArray(childNodeValue)) {

      }
      else if (typeof childNodeValue === 'object') {
        const newNode = createNode({
          type: 'group',
          name: childNodeId,
          value: childNodeValue
        })
        getNodesFromGroup(childNodeValue, newNode)
      }
    }
  }
}


const formSectionOuter = createSection('formSectionOuter', () => ({
  $el: 'div',
  children: '$slots.default',
  attrs: {
    key: '$id',
    id: '$id',
    class: '$classes.outer',
    'data-prerender': '$fns.preRenderSteps()',
    'data-family': '$family || undefined',
    'data-type': '$type',
    'data-multiple':
      '$attrs.multiple || ($type != "select" && $options != undefined) || undefined',
    'data-disabled': '$disabled || undefined',
    'data-invalid':
      '$state.valid === false && $state.validationVisible || undefined',
    'data-errors': '$state.errors || undefined',
    'data-submitted': '$state.submitted || undefined',
  },
}))

const formSectionStep: FormKitTypeDefinition = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  // schema: formSectionOuter(
  //   wrapper(
  //     label(),
  //     '$slots.default'
  //   )
  // ),
  schema: outer(
    wrapper(
      label('$label'),
      inner(
        icon('prefix', 'label'),
        prefix(),
        createSection('input', () => ({
          $el: 'div',
          children: '$slots.default'
        }))(),
        suffix(),
        icon('suffix')
      )
    ),
    help('$help'),
    messages(message('$message.value'))
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: 'group',
  /**
   * The family of inputs this one belongs too. For example "text" and "email"
   * are both part of the "text" family. This is primary used for styling.
   */
  family: 'form-section',
  /**
   * An array of extra props to accept for this input.
   */
  props: [
    'currentStep',
    'loadLocalStorageNodes'
  ],
  /**
   * Additional features that should be added to your input
   */
}



