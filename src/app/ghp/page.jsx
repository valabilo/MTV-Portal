'use client'
/**
 * app/ghp/page.jsx – GHP Orientation (/ghp)
 *
 * Standalone GHP flow — no connection to the Apply page.
 *
 * Step 1 – Watch the orientation video  (mark as watched to unlock quiz)
 * Step 2 – Take the qualification quiz  (≥70% to pass)
 * Step 3 – Claim certificate            (enter name + email → sent via Gmail)
 *
 * The generated certificate number can optionally be referenced
 * when filling out an MTV application, but it is NOT a hard prerequisite.
 */

import { useState } from 'react'
import { useToast } from '@/hooks/useToast'
import Toast        from '@/components/ui/Toast'
import StepsBar     from '@/components/ghp/StepsBar'
import VideoCard    from '@/components/ghp/VideoCard'
import QuizCard     from '@/components/ghp/QuizCard'
import CertCard     from '@/components/ghp/CertCard'
import styles       from './ghp.module.css'

export default function GHPPage() {
  const [videoWatched, setVideoWatched] = useState(false)
  const [quizPassed,   setQuizPassed]   = useState(false)
  const [quizScore,    setQuizScore]    = useState(0)
  const { toastState, showToast }       = useToast()

  // 1 = video, 2 = quiz, 3 = certificate
  const currentStep = quizPassed ? 3 : videoWatched ? 2 : 1

  function handleMarkWatched() {
    setVideoWatched(true)
    showToast('Video marked as watched! Scroll down to take the quiz.')
    setTimeout(() => {
      document.getElementById('ghp-quiz')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 400)
  }

  function handleQuizPass(score) {
    setQuizScore(score)
    setQuizPassed(true)
    showToast('🎉 Congratulations! Scroll down to claim your certificate.')
    setTimeout(() => {
      document.getElementById('ghp-cert')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 500)
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>▶️ GHP Orientation</h1>
          <p>
            Complete all three steps to receive your Good Hygiene Practices
            Certificate of Completion via email.
          </p>
        </div>
      </div>

      <div className={styles.page}>
        <div className="container">

          {/* 3-step progress indicator */}
          <StepsBar currentStep={currentStep} />

          <div className={styles.panels}>

            {/* STEP 1 – Watch video */}
            <VideoCard
              watched={videoWatched}
              onMarkWatched={handleMarkWatched}
            />

            {/* STEP 2 – Quiz */}
            <div id="ghp-quiz">
              <QuizCard
                unlocked={videoWatched}
                onPass={handleQuizPass}
                showToast={showToast}
              />
            </div>

            {/* STEP 3 – Certificate (no Apply link here) */}
            <div id="ghp-cert">
              <CertCard
                unlocked={quizPassed}
                quizScore={quizScore}
                showToast={showToast}
              />
            </div>

          </div>
        </div>
      </div>

      <Toast {...toastState} />
    </>
  )
}
