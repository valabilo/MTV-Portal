"use client";
/**
 * app/ghp/page.jsx - GHP Orientation (/ghp)
 */

import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";
import StepsBar from "@/components/ghp/StepsBar";
import VideoCard from "@/components/ghp/VideoCard";
import QuizCard from "@/components/ghp/QuizCard";
import CertCard from "@/components/ghp/CertCard";
import styles from "./ghp.module.css";

export default function GHPPage() {
  const [videoWatched, setVideoWatched] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(10);
  const { toastState, showToast } = useToast();

  const currentStep = quizPassed ? 3 : videoWatched ? 2 : 1;

  function handleMarkWatched() {
    setVideoWatched(true);
    showToast("Video marked as watched. Scroll down to take the quiz.");
    setTimeout(() => {
      document
        .getElementById("ghp-quiz")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  }

  function handleQuizPass(score, total) {
    setQuizScore(score);
    setQuizTotal(total ?? 10);
    setQuizPassed(true);
    showToast("You passed. Scroll down to claim your certificate.");
    setTimeout(() => {
      document
        .getElementById("ghp-cert")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 500);
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Good Hygienic Practice (GHP) Orientation</h1>
          <p>Required orientation for MTV drivers and pahinante before registration.</p>
        </div>
      </div>

      <div className={styles.page}>
        <div className="container">
          <section className={styles.intro}>
            <div>
              <h2>Good Hygienic Practices (GHP) Virtual Orientation</h2>
              <p>
                GHP Orientation for MTV drivers and pahinante is conducted to ensure awareness and understanding of sanitary practices, proper handling procedures, safety measures in the transport of meat, and NMIS rules and regulations.
              </p>
            </div>
            <div>
              <h2>Online Examination</h2>
              <p>
                An online examination is administered after the orientation. Participants who obtain a passing score of at least 70% shall be issued a Certificate of Attendance. Retakes are allowed when the passing score is not met.
              </p>
            </div>
          </section>

          <section className={styles.reminders}>
            <h2>Important Reminders</h2>
            <ul>
              <li>Watch the entire orientation video before taking the exam.</li>
              <li>Ensure a stable internet connection while taking the online exam.</li>
              <li>There is no limit to the number of retakes if you do not pass.</li>
              <li>The Certificate of Completion is required for MTV registration at the NMIS office.</li>
            </ul>
          </section>

          <StepsBar currentStep={currentStep} />

          <div className={styles.panels}>
            <VideoCard watched={videoWatched} onMarkWatched={handleMarkWatched} />

            <div id="ghp-quiz">
              <QuizCard
                unlocked={videoWatched}
                onPass={handleQuizPass}
                showToast={showToast}
              />
            </div>

            <div id="ghp-cert">
              <CertCard
                unlocked={quizPassed}
                quizScore={quizScore}
                quizTotal={quizTotal}
                showToast={showToast}
              />
            </div>
          </div>
        </div>
      </div>

      <Toast {...toastState} />
    </>
  );
}
