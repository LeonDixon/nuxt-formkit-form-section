import { defaultConfig } from '@formkit/vue'
import { rootClasses } from './formkit.theme'
import { formSectionPlugin } from './formkit/plugins/form-section-plugin'
import { createLocalStoragePlugin } from './formkit/plugins/local-storage-plugin'
export default defaultConfig({
  config: {
    rootClasses
  },
  plugins: [
    formSectionPlugin(),
    createLocalStoragePlugin({
      overwriteOnCommit: false
    })
  ]
})