import { defaultConfig } from '@formkit/vue'
import { rootClasses } from './formkit.theme'
import { formSectionPlugin } from './formkit/plugins/form-section-plugin'
import { createLocalStoragePlugin } from './formkit/plugins/local-storage-plugin'
import { createProPlugin, inputs } from '@formkit/pro'
export default defaultConfig({
  config: {
    rootClasses
  },
  plugins: [
    createProPlugin('fk-a32f74eaf3', inputs),
    formSectionPlugin(),
    createLocalStoragePlugin({
      overwriteOnCommit: false
    })
  ]
})