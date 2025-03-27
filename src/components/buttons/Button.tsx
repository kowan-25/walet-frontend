import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'medium' | 'small'
  outline?: boolean
  asChild?: boolean
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  outline,
  asChild,
  ...props
}) => {
  const Component = asChild ? 'div' : 'button'

  return (
    <Component
      {...props}
      className={cn(
        'px-6 py-3 rounded-[10px] flex justify-center items-center font-semibold hover:opacity-80 transition-opacity duration-300 hover:cursor-pointer',
        variant === 'primary' && 'text-light bg-primary shadow-primary',
        variant === 'secondary' && 'text-light bg-secondary shadow-secondary',
        variant === 'ghost' && 'text-primary shadow-none',
        size === 'medium' && 'text-lg gap-4',
        size === 'small' && 'text-sm gap-3',
        outline && 'shadow-[inset_0_0_0_2px_rgb(0,0,0)] bg-white',
        outline && variant === 'primary' && 'text-primary',
        outline && variant === 'secondary' && 'text-secondary',
        props.className,
      )}
    >
      {props.children}
    </Component>
  )
}

export default Button
