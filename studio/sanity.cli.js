import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    // IMPORTANT: Remplace ces valeurs apres avoir cree ton projet sur sanity.io
    projectId: 'cilcs3mk',
    dataset: 'production'
  },
  studioHost: 'writer-blog-studio'
})
