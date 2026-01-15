import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    // IMPORTANT: Remplace ces valeurs apres avoir cree ton projet sur sanity.io
    projectId: 'YOUR_PROJECT_ID',
    dataset: 'production'
  },
  studioHost: 'writer-blog-studio'
})
