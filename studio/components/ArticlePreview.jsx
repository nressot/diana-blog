// URL du frontend de developpement
const FRONTEND_URL = 'http://localhost:5173'

export default function ArticlePreview(props) {
  const {document} = props
  const slug = document?.displayed?.slug?.current

  if (!slug) {
    return (
      <div style={{padding: '2rem', textAlign: 'center', color: '#666'}}>
        <p>Ajoutez un slug a l'article pour voir l'apercu.</p>
      </div>
    )
  }

  const previewUrl = `${FRONTEND_URL}/article/${slug}`

  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <div style={{padding: '0.5rem', background: '#f5f5f5', borderBottom: '1px solid #ddd'}}>
        <a href={previewUrl} target="_blank" rel="noopener noreferrer">
          Ouvrir dans un nouvel onglet
        </a>
      </div>
      <iframe
        src={previewUrl}
        style={{flex: 1, width: '100%', border: 'none'}}
        title="Apercu de l'article"
      />
    </div>
  )
}
