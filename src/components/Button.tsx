import styles from './Button.module.css'

interface ButtonProps {
  color?: 'primary' | 'secondary' | 'danger' | 'sucess'
}

export function Button(button: ButtonProps) {
  return <button>Enviar</button>
}
