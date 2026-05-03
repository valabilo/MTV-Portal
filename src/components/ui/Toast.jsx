'use client'
/**
 * components/ui/Toast.jsx
 *
 * Renders a fixed toast notification at the bottom-right of the screen.
 * Controlled by the useToast() hook.
 *
 * Props:
 *   message  {string}   Text to display
 *   visible  {boolean}  Whether the toast is shown
 *   isError  {boolean}  Red variant if true, green otherwise
 */

import styles from './Toast.module.css'

export default function Toast({ message, visible, isError = false }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        styles.toast,
        visible  ? styles.show  : '',
        isError  ? styles.error : '',
      ].join(' ')}
    >
      {isError ? '⚠️' : '✅'} {message}
    </div>
  )
}
