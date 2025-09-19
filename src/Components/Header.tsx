import { useState } from "react"
import { Home, Bell, User, LogOut, LayoutDashboard, ArrowLeft, Menu, X, Library } from "lucide-react"

interface HeaderNavigationProps {
  role?: "user" | "admin"
  showBack?: boolean
  backLink?: string
  active?: "Dashboard" | "Notifications" | "Home" | "Profile" | ""
}

export function HeaderNavigation({ role = "user", showBack = false, backLink = "", active = "" }: HeaderNavigationProps) {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function handleLogout() {

  }

  const navigationItems = [
    { name: "Home", href: "/homepage", icon: Home },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Profile", href: "profile", icon: User }
  ]

  if (role === "admin") {
    navigationItems.splice(0, 0, { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard })
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)


  return (

    <header className={`sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md`}>

      <div className="px-4 mx-auto max-w-7xl">

        <div className="flex items-center justify-between h-16">

          {/* Back button */}
          <div className="flex items-center">
            {showBack ?
              (
                <a href={backLink} className="flex items-center gap-1 px-2 py-1 transition-colors rounded hover:bg-gray-200">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="sr-only">Go back</span>
                </a>
              )
              :
              <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-transparent md:text-3xl bg-clip-text bg-gradient-to-r from-green-700 to-green-900 drop-shadow-sm">
                Readify
              </h2>
            }
          </div>

          {/* Navigation (Desktop) */}
          <nav className="items-center hidden space-x-2 md:flex">

            {/* Render Buttons */}
            {
              navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <a key={item.name} href={item.href}
                    className={`flex items-center gap-2 px-3 py-1 transition-colors rounded hover:bg-gray-200 ${active === item.name && "text-green-700"}`}>
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                )
              })
            }

            {/* Logout Button */}
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1 text-red-600 transition-colors rounded hover:bg-red-100">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

          </nav>

          {/* Menu Button */}
          <button
            type="button"
            className="p-2 transition-colors rounded md:hidden hover:bg-gray-200"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

        {/* Menu */}
        {
          isMobileMenuOpen && (

            <div className="py-2 border-t border-gray-200 md:hidden">

              <nav className="flex flex-col space-y-1">

                {/* Render Buttons */}
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 transition-colors rounded hover:bg-gray-200 ${active === item.name && "text-green-700"}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </a>
                  )
                })}

                {/* Logout Button */}
                <button
                  className="flex items-center gap-3 px-3 py-2 text-white transition-colors bg-red-700 rounded hover:bg-red-600"
                  onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>

              </nav>

            </div>
          )}

      </div>

    </header>

  )

}
