import { createNode, type FormKitNode, type FormKitPlugin, type FormKitProps, type FormKitTypeDefinition } from "@formkit/core";
import { createSection, wrapper, label, outer, inner, icon, prefix, suffix, help, messages, message, type FormKitSchemaExtendableSection, type FormKitInputs, group } from '@formkit/inputs'
import { clone } from "@formkit/utils";

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

const sectionNodes: FormKitNode[] = []
const sectionRegistery = new Map<string, FormKitNode>;

function getSectionNode(id: string): FormKitNode | undefined {
  console.log('hit', sectionRegistery.get(id))
  setTimeout(() => {
    console.log('hit', sectionRegistery.get(id))

  }, 100)
  return sectionRegistery.get(id)
}

const callbacksToDestroyNodes: (() => void)[] = []
export function formSectionPlugin(options: {
  localStoragePrefix?: string
} = {}): FormKitPlugin {
  const nuxtContentMultiStepPlugin = (node: FormKitNode) => {
    if (!node.context) return
    if (node.props.type !== 'form-section')
      return

    sectionNodes.push(node)
    node.context!.loaded = false

    if (!node.parent)
      throw new Error('lol get rekt')

    const { parent } = node
    if (node.props.loadLocalStorageNodes && window) {
      const localStorageId = options.localStoragePrefix ?? 'formkit'
      const localStorageData = localStorage.getItem(`${localStorageId}-${parent.name}`)
      if (localStorageData) {
        const { data }: { data: object } = JSON.parse(localStorageData)
        Object.keys(data).map((key) => {
          if (!getNode(key)) {
            const formNode = createNode({
              type: 'group',
              name: key + 1,
              props: {
                type: 'form',
                id: key + 1
              }
            })
            getNodesFromGroup(data[key as keyof typeof data], formNode)
            node.context!.fns.getSectionNode = getSectionNode
            node.on('destroying', () => {
              sectionRegistery.clear()
            })
          }
        })
      }
    }
  }

  nuxtContentMultiStepPlugin.library = (node: FormKitNode) => {
    return node.define(formSectionStep)
  }

  return nuxtContentMultiStepPlugin
}

function getNodesFromGroup(node: object, parent: FormKitNode) {

  const childrenNodesIds = Object.keys(node)
  for (const childNodeId of childrenNodesIds) {
    console.log('for', childNodeId)
    if (getNode(childNodeId))
      continue
    const childNodeValue = node[childNodeId as keyof typeof node]
    let newNode: FormKitNode
    if (typeof childNodeValue === 'number' || typeof childNodeValue === 'string') {
      newNode = createNode({
        name: childNodeId,
        props: {
          id: childNodeId,
          type: 'text'
        },
        value: childNodeValue
      })
      newNode.props.id = childNodeId
      parent.add(newNode)

    }
    else if (Array.isArray(childNodeValue)) {

    }
    else if (typeof childNodeValue === 'object') {
      console.log(childNodeId)
      newNode = createNode({
        type: 'group',
        name: childNodeId,
        props: {
          type: 'group',
          id: childNodeId
        },
        value: childNodeValue
      })

      parent.add(newNode)

      getNodesFromGroup(childNodeValue, newNode)
    }
    console.log('end')
    console.log('test', childNodeId, newNode!)
    sectionRegistery.set(childNodeId, newNode!)
    console.log('seciton', getSectionNode(childNodeId))
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



