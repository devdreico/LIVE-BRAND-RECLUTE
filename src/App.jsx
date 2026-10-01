import { useCallback, useEffect, useState } from 'react'
import Navbar from './components/landing/Navbar.jsx'
import Hero from './components/landing/Hero.jsx'
import Benefits from './components/landing/Benefits.jsx'
import StreamerGrid from './components/landing/StreamerGrid.jsx'
import StatsBar from './components/landing/StatsBar.jsx'
import ApplyForm from './components/landing/ApplyForm.jsx'
import Footer from './components/landing/Footer.jsx'
import PanelLayout from './components/panel/PanelLayout.jsx'
import KpiCards from './components/panel/KpiCards.jsx'
import StatusOverview from './components/panel/StatusOverview.jsx'
import ApplicantsTable from './components/panel/ApplicantsTable.jsx'
import ApplicantDetail from './components/panel/ApplicantDetail.jsx'
import { useApplicants } from './hooks/useApplicants.js'
import { mockStreamers } from './data/mockStreamers.js'

function routeFromHash() {
  return window.location.hash.startsWith('#/panel') ? 'panel' : 'landing'
}

export default function App() {
  const { applicants, stats, addApplicant, updateStatus, removeApplicant } = useApplicants()
  const [route, setRoute] = useState(routeFromHash)
  const [tab, setTab] = useState('resumen')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(routeFromHash())
      if (routeFromHash() === 'panel') setSelected(null)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const openPanel = useCallback(() => {
    window.location.hash = '/panel'
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const exitPanel = useCallback(() => {
    window.location.hash = '/'
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const goToApply = useCallback(() => {
    document.getElementById('postular')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  if (route === 'panel') {
    return (
      <>
        <PanelLayout activeTab={tab} onTabChange={setTab} onExit={exitPanel}>
          <KpiCards stats={stats} applicants={applicants} />

          {tab === 'resumen' ? (
            <StatusOverview
              stats={stats}
              applicants={applicants}
              onSelect={setSelected}
              onShowAll={() => setTab('postulantes')}
            />
          ) : (
            <div className="mt-6">
              <ApplicantsTable
                applicants={applicants}
                onSelect={setSelected}
                onStatusChange={updateStatus}
              />
            </div>
          )}
        </PanelLayout>

        <ApplicantDetail
          applicant={selected}
          onClose={() => setSelected(null)}
          onStatusChange={updateStatus}
          onDelete={removeApplicant}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar onOpenPanel={openPanel} />
      <main>
        <Hero onApply={goToApply} />
        <Benefits />
        <StreamerGrid streamers={mockStreamers} />
        <StatsBar stats={stats} />
        <ApplyForm onSubmit={addApplicant} />
      </main>
      <Footer onOpenPanel={openPanel} />
    </div>
  )
}
