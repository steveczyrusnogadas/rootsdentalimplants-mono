import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/prototype/home')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/prototype/home"!</div>
}
