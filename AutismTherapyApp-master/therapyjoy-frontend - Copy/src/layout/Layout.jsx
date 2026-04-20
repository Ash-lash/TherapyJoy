import Navbar from "./Navbar"

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="layout-main">
        {children}
      </main>
    </>
  )
}
