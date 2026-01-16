import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Info, Truck } from 'lucide-react'
import DescriptionTab from './DescriptionTab'
import DetailsTab from './DetailsTab'
import ShippingTab from './ShippingTab'

const tabs = [
  { id: 'description', label: 'Description', icon: BookOpen },
  { id: 'details', label: 'Details', icon: Info },
  { id: 'shipping', label: 'Livraison', icon: Truck },
]

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('description')

  return (
    <div>
      {/* Tab headers */}
      <div className="flex border-b border-neutral-300 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-4 flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="py-8"
        >
          {activeTab === 'description' && <DescriptionTab product={product} />}
          {activeTab === 'details' && <DetailsTab product={product} />}
          {activeTab === 'shipping' && <ShippingTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
