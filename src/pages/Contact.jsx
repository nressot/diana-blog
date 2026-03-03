import { useState } from 'react'
import { Mail, MapPin, Clock, Send, Instagram, Phone, Globe, Twitter, Linkedin, Facebook, Youtube } from 'lucide-react'
import SEO from '../components/SEO'
import { FAQSchema } from '../components/StructuredData'
import { useContactPage } from '../lib/usePages'

// Map des icones
const iconMap = {
  Mail, MapPin, Clock, Phone, Globe
}

const socialIconMap = {
  Instagram, Twitter, Linkedin, Facebook, Youtube
}

// Donnees par defaut
const defaultContactInfo = [
  { icon: 'Mail', title: 'Email', value: 'diana@covendediana.ch', href: 'mailto:diana@covendediana.ch' },
  { icon: 'MapPin', title: 'Localisation', value: 'Geneve, Suisse', href: null },
  { icon: 'Clock', title: 'Delai de reponse', value: 'Sous 48h', href: null }
]

const defaultSocialLinks = [
  { platform: 'Instagram', url: 'https://instagram.com/neelagram', handle: '@neelagram' }
]

const defaultFaq = [
  { question: 'Acceptez-vous les collaborations ?', answer: 'Oui, je suis ouverte aux collaborations editoriales, aux interviews et aux projets creatifs. N\'hesitez pas a me presenter votre projet.' },
  { question: 'Puis-je republier vos textes ?', answer: 'Mes textes sont proteges par le droit d\'auteur. Pour toute republication, merci de me contacter au prealable pour obtenir une autorisation.' },
  { question: 'Donnez-vous des conseils d\'ecriture ?', answer: 'Je partage regulierement des conseils sur mon blog. Pour un accompagnement personnalise, contactez-moi pour discuter de vos besoins.' }
]

export default function Contact() {
  const { data: pageContent } = useContactPage()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  // Extraire le contenu avec fallback
  const hero = pageContent?.hero || { title: 'Contactez-moi', subtitle: 'Une question, une collaboration, ou simplement envie d\'echanger ? N\'hesitez pas a me laisser un message.' }
  const contactInfo = pageContent?.contactInfo || defaultContactInfo
  const socialSection = pageContent?.socialSection || { title: 'Retrouvez-moi sur', links: defaultSocialLinks }
  const form = pageContent?.form || { title: 'Envoyez-moi un message', nameLabel: 'Nom complet', emailLabel: 'Email', subjectLabel: 'Sujet', messageLabel: 'Message', submitText: 'Envoyer le message', successMessage: 'Message envoye ! Je vous repondrai dans les plus brefs delais.' }
  const faqSection = pageContent?.faqSection || { title: 'Questions frequentes', items: defaultFaq }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    alert(form.successMessage)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div>
      <SEO
        title="Contact"
        description="Contactez Diana pour vos questions, collaborations ou simplement pour echanger. Formulaire de contact et informations pour me joindre."
        url="/contact"
      />
      <FAQSchema items={faqSection.items} />
      {/* Hero Section */}
      <section className="py-10 lg:py-14 bg-gradient-to-b from-cream-200 to-transparent dark:from-neutral-900/50 dark:to-transparent">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-semibold mb-6">
              {hero.title}
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              {hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 lg:py-10">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold mb-6">Informations</h2>

              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => {
                  const IconComponent = iconMap[info.icon] || Mail
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                        <IconComponent className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{info.title}</h3>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-neutral-600 hover:text-primary-600 transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-neutral-600">{info.value}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <h3 className="font-semibold mb-4">{socialSection.title}</h3>
              <div className="space-y-3">
                {(socialSection.links || defaultSocialLinks).map((social, index) => {
                  const SocialIcon = socialIconMap[social.platform] || Instagram
                  return (
                    <a
                      key={index}
                      href={social.url}
                      className="flex items-center gap-3 p-3 rounded-xl bg-cream-200 border border-neutral-200 hover:border-primary-500 transition-colors"
                    >
                      <SocialIcon className="w-5 h-5 text-neutral-600" />
                      <span className="font-medium">{social.platform}</span>
                      <span className="text-sm text-neutral-500 ml-auto">{social.handle}</span>
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-primary-600 rounded-2xl p-6 lg:p-8">
                <h2 className="text-2xl font-semibold mb-6 text-white">{form.title}</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-white">
                        {form.nameLabel}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        required
                        className="w-full h-12 px-4 rounded-xl border-0 bg-white/20 text-white placeholder:text-white/50 focus:bg-white/30 focus:ring-2 focus:ring-white/50 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">
                        {form.emailLabel}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        required
                        className="w-full h-12 px-4 rounded-xl border-0 bg-white/20 text-white placeholder:text-white/50 focus:bg-white/30 focus:ring-2 focus:ring-white/50 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2 text-white">
                      {form.subjectLabel}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="De quoi souhaitez-vous parler ?"
                      required
                      className="w-full h-12 px-4 rounded-xl border-0 bg-white/20 text-white placeholder:text-white/50 focus:bg-white/30 focus:ring-2 focus:ring-white/50 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-white">
                      {form.messageLabel}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Votre message..."
                      rows={6}
                      required
                      className="w-full px-4 py-3 rounded-xl border-0 bg-white/20 text-white placeholder:text-white/50 focus:bg-white/30 focus:ring-2 focus:ring-white/50 outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-white text-primary-600 font-medium hover:bg-white/90 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {form.submitText}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 lg:py-10 bg-cream-200 dark:bg-neutral-900/50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-8 text-center">
              {faqSection.title}
            </h2>
            <div className="space-y-4">
              {(faqSection.items || defaultFaq).map((faq, index) => (
                <div
                  key={index}
                  className="bg-cream-50 dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800"
                >
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
