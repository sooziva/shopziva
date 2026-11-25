import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom'
import { legacyHashToPath } from './lib/navigation'
import {
  AdminRoute,
  FansRoute,
  HomePage,
  PageRoute,
  ProductRoute,
  StoreLayout,
} from './App'
import './index.css'

// Migrate bookmarks like #/fans or #shop/makeup before the router boots.
const legacyPath = legacyHashToPath(window.location.hash)
if (legacyPath) {
  window.history.replaceState(
    null,
    '',
    `${legacyPath}${window.location.search}`,
  )
}

const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminRoute />,
  },
  {
    element: <StoreLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop/:category', element: <HomePage /> },
      { path: 'product/:id', element: <ProductRoute /> },
      { path: 'page/:id', element: <PageRoute /> },
      { path: 'fans', element: <FansRoute /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
