import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line no-unused-vars
import { CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react'

function Toast({ message, type = 'success', isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />
      case 'error':
        return <XCircle size={20} />
      case 'warning':
        return <AlertCircle size={20} />
      case 'info':
        return <Info size={20} />
      default:
        return <CheckCircle size={20} />
    }
  }

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'toast-success'
      case 'error':
        return 'toast-error'
      case 'warning':
        return 'toast-warning'
      case 'info':
        return 'toast-info'
      default:
        return 'toast-success'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`toast ${getTypeClass()}`}
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="toast-icon">
            {getIcon()}
          </div>
          <span className="toast-message">{message}</span>
          <button
            onClick={onClose}
            className="toast-close"
            aria-label="Fechar notificação"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
