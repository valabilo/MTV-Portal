'use client'
/**
 * components/ghp/VideoCard.jsx
 *
 * Props:
 *   watched        {boolean}    Whether the video has been marked watched
 *   onMarkWatched {() => void} Callback when user marks as watched
 */

import { useEffect, useRef } from 'react'
import styles from './VideoCard.module.css'

const VIDEO_ID = 'ovEvULLfPvI'
const YOUTUBE_API_SRC = 'https://www.youtube.com/iframe_api'

function loadYouTubeAPI(onReady) {
  if (window.YT?.Player) {
    onReady()
    return
  }

  const previousReady = window.onYouTubeIframeAPIReady
  window.onYouTubeIframeAPIReady = () => {
    if (typeof previousReady === 'function') previousReady()
    onReady()
  }

  if (!document.querySelector(`script[src="${YOUTUBE_API_SRC}"]`)) {
    const script = document.createElement('script')
    script.src = YOUTUBE_API_SRC
    document.body.appendChild(script)
  }
}

export default function VideoCard({ watched, onMarkWatched }) {
  const playerHostRef = useRef(null)
  const playerRef = useRef(null)
  const completedRef = useRef(false)
  const onMarkWatchedRef = useRef(onMarkWatched)

  useEffect(() => {
    onMarkWatchedRef.current = onMarkWatched
  }, [onMarkWatched])

  useEffect(() => {
    if (watched) completedRef.current = true
  }, [watched])

  useEffect(() => {
    let cancelled = false

    function completeVideo() {
      if (completedRef.current) return
      completedRef.current = true
      onMarkWatchedRef.current()
    }

    function createPlayer() {
      if (cancelled || !playerHostRef.current || playerRef.current) return

      playerRef.current = new window.YT.Player(playerHostRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          playsinline: 1,
          rel: 0,
        },
        events: {
          onStateChange(event) {
            if (event.data === window.YT.PlayerState.ENDED) {
              completeVideo()
            }
          },
        },
      })
    }

    loadYouTubeAPI(createPlayer)

    return () => {
      cancelled = true
      if (playerRef.current?.destroy) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [])

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>Play</div>
        <div className={styles.headerText}>
          <h3>Step 1 - Watch GHP Orientation Video</h3>
          <p>Required before you can take the qualification quiz</p>
        </div>
        <span className={`tag ${watched ? 'tag-active' : 'tag-pending'}`} style={{ marginLeft: 'auto', flexShrink: 0 }}>
          {watched ? 'Watched' : 'Not Watched'}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.videoArea}>
          <div ref={playerHostRef} className={styles.videoPlayer} />
        </div>

        <div className={styles.meta}>
          <span><strong>Duration:</strong> 45 minutes</span>
          <span><strong>Required:</strong> Yes</span>
          <span><strong>Updated:</strong> 2025</span>
          {watched && <span className="tag tag-active">Watched</span>}
        </div>

        <div className={styles.note}>
          <strong>Note:</strong> This orientation covers proper sanitation, hygiene, and handling
          requirements for all Meat Transport Vehicles. Watching this video in full is a
          prerequisite before taking the qualification quiz.
        </div>

        {!watched && (
          <div className={styles.action}>
            <button className="btn btn-primary" onClick={onMarkWatched}>
              Mark as Watched &amp; Proceed to Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
