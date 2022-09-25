import { useState } from 'react';
import Slider, { Slide } from './slider';
import Work from './work';
import Button from './button';
import type { GalleryType, WorkType } from '../content/content-types';

import styles from './gallery.module.css';

export default function Gallery({
  name,
  slug,
  work,
  showPagination,
}: GalleryType) {
  const [step, setStep] = useState(0);

  return (
    <article>
      <header className={styles.header}>
        <h2>{name}</h2>

        {work.length > 1 && (
          <nav>
            {showPagination ? (
              <ul className="paginationList">
                {work.map((w, i) => (
                  <li key={getKey(w)}>
                    <a
                      href={`/${slug}#${i + 1}`}
                      className={step === i ? styles.active : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        setStep(i);
                      }}
                    >
                      {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <Button
                  aria-label="previous"
                  disabled={step <= 0}
                  onClick={() => setStep(step - 1)}
                >
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    width={24}
                    height={24}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Button>

                <Button
                  aria-label="next"
                  onClick={() => setStep(step + 1)}
                  disabled={step >= work.length - 1}
                >
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    width={24}
                    height={24}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </>
            )}
          </nav>
        )}
      </header>

      <section>
        <Slider step={step} onChange={setStep}>
          {work.map((w, i) => (
            <Slide key={getKey(w)}>
              <div className={styles.horizontalSlideWrapper}>
                <div className={styles.horizontalContainer}>
                  <Work
                    {...w}
                    galleryName={name}
                    galleryIndex={i}
                    id={i}
                    priority={i === 0 && step === 0}
                    loading={
                      showPagination ||
                      step - 1 === i ||
                      step === i ||
                      step + 1 === i
                        ? 'eager'
                        : 'lazy'
                    }
                  />
                </div>
              </div>
            </Slide>
          ))}
        </Slider>
      </section>
    </article>
  );
}

function getKey(work: WorkType) {
  switch (work.type) {
    case 'Photograph':
      return work.file;
    case 'MultiPartPhotograph':
      return work.parts[0].file;
    default:
      return '';
  }
}
