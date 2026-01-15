import { useState } from 'react'
import { Mail, MapPin, Clock, Send, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
    alert('Message envoyé ! Je vous répondrai dans les plus brefs délais.')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contact@diana.com',
      href: 'mailto:contact@diana.com'
    },
    {
      icon: MapPin,
      title: 'Localisation',
      value: 'Paris, France',
      href: null
    },
    {
      icon: Clock,
      title: 'Délai de réponse',
      value: 'Sous 48h',
      href: null
    }
  ]

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter', handle: '@diana.writes' },
    { icon: Instagram, href: '#', label: 'Instagram', handle: '@diana.writes' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', handle: 'Diana' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="py-10 lg:py-14 bg-gradient-to-b from-cream-200 to-transparent dark:from-neutral-900/50 dark:to-transparent">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-semibold mb-6">
              Contactez-moi
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Une question, une collaboration, ou simplement envie d'échanger ?
              N'hésitez pas à me laisser un message.
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
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-primary-600 dark:text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{info.title}</h3>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-neutral-600 dark:text-neutral-400">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold mb-4">Retrouvez-moi sur</h3>
              <div className="space-y-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="flex items-center gap-3 p-3 rounded-xl bg-cream-200 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-primary-500 transition-colors"
                  >
                    <social.icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                    <span className="font-medium">{social.label}</span>
                    <span className="text-sm text-neutral-500 ml-auto">{social.handle}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-cream-50 dark:bg-neutral-900 rounded-2xl p-6 lg:p-8 border border-neutral-200 dark:border-neutral-800">
                <h2 className="text-2xl font-semibold mb-6">Envoyez-moi un message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        required
                        className="w-full h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-cream-100 dark:bg-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        required
                        className="w-full h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-cream-100 dark:bg-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Sujet
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="De quoi souhaitez-vous parler ?"
                      required
                      className="w-full h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-cream-100 dark:bg-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Votre message..."
                      rows={6}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-cream-100 dark:bg-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer le message
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
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Acceptez-vous les collaborations ?',
                  a: 'Oui, je suis ouverte aux collaborations éditoriales, aux interviews et aux projets créatifs. N\'hésitez pas à me présenter votre projet.'
                },
                {
                  q: 'Puis-je republier vos textes ?',
                  a: 'Mes textes sont protégés par le droit d\'auteur. Pour toute republication, merci de me contacter au préalable pour obtenir une autorisation.'
                },
                {
                  q: 'Donnez-vous des conseils d\'écriture ?',
                  a: 'Je partage régulièrement des conseils sur mon blog. Pour un accompagnement personnalisé, contactez-moi pour discuter de vos besoins.'
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-cream-50 dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800"
                >
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
