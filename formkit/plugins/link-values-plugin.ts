import type { FormKitNode } from '@formkit/core'
import { undefine } from '@formkit/utils'

export function createLinkValuesPlugin() {
  const linkValues: Record<string, FormKitNode[]> = {}
  let linkInstance = 0

  function makeNodeUnique(node: FormKitNode) {
    node.props.altName = `${node.name}_${linkInstance++}`
  }

  return (node: FormKitNode) => {
    node.addProps(['linkValueId'])
    const linkValueIdDefined = undefine(node.props.linkValueId)

    if (!linkValueIdDefined)
      return
    node.on('created', () => {
      const linkId = node.props.linkValueId as string

      makeNodeUnique(node)

      if (linkValues[linkId] && Array.isArray(linkValues[linkId]))
        linkValues[linkId].push(node)
      else
        linkValues[linkId] = [node]

      node.hook.commit((value, next) => {
        if (linkValues[linkId] && Array.isArray(linkValues[linkId])) {
          linkValues[linkId].forEach((targetNode) => {
            if (node.props.id === targetNode.props.id)
              return
            if (targetNode.value !== value)
              void targetNode.input(value)
          })
        }
        // eslint-disable-next-line ts/no-unsafe-return
        return next(value)
      })
    })

    node.on('destroying', () => {
      const linkId = node.props.linkValueId as string
      linkValues[linkId] = linkValues[linkId].filter(linkValue => linkValue.props.altName !== node.props.altName)
    })
  }
}