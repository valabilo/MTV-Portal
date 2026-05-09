"use client";

import { useEffect, useState } from "react";
import styles from "./guidelines.module.css";

export default function ZoomableFigure({
  src,
  alt,
  figureClassName,
  imageClassName,
  children,
}) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "+" || event.key === "=") {
        setZoom((value) => Math.min(value + 0.25, 3));
      }
      if (event.key === "-") {
        setZoom((value) => Math.max(value - 0.25, 1));
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function closeViewer() {
    setOpen(false);
    setZoom(1);
  }

  return (
    <>
      <figure className={figureClassName}>
        <button
          type="button"
          className={styles.zoomTrigger}
          onClick={() => setOpen(true)}
          aria-label={`Open larger view of ${alt}`}>
          <img className={imageClassName} src={src} alt={alt} />
          <span>View</span>
        </button>
        {children}
      </figure>

      {open ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeViewer();
          }}>
          <div className={styles.lightboxToolbar}>
            <strong>{alt}</strong>
            <div>
              <button
                type="button"
                onClick={() => setZoom((value) => Math.max(value - 0.25, 1))}>
                -
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoom((value) => Math.min(value + 0.25, 3))}>
                +
              </button>
              <button type="button" onClick={() => setZoom(1)}>
                Reset
              </button>
              <button type="button" onClick={closeViewer}>
                Close
              </button>
            </div>
          </div>
          <div className={styles.lightboxCanvas}>
            <img
              src={src}
              alt={alt}
              style={{ transform: `scale(${zoom})` }}
              draggable="false"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
