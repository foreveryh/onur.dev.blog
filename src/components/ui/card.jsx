import { cn } from '@/lib/utils'

function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm', className)}
      {...props}
      data-oid="7x9roey"
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} data-oid="165urdp" />
}

function CardTitle({ className, ...props }) {
  return <h3 className={cn('leading-none font-semibold tracking-tight', className)} {...props} data-oid="f9fw5sa" />
}

function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm text-gray-500', className)} {...props} data-oid=".vc:m0j" />
}

function CardContent({ className, ...props }) {
  return <div className={cn('p-6 pt-0', className)} {...props} data-oid="fr88.u1" />
}

function CardFooter({ className, ...props }) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} data-oid="szarur6" />
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
