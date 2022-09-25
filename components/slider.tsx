import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from 'react';
import classNames from 'classnames';
import styles from './slider.module.css';

const SlideContext = React.createContext<number | null>(null);

interface SliderProps {
  id?: string;
  className?: string;
  /** the step currently rendered */
  step: number;
  onChange: (step: number) => void;
  /** proportion of the next and previous slides that should be visible */
  offset?: number;
  /** percentage of a slide that needs to be scrolled to trigger a change */
  threshold?: number;
  children: React.ReactElement<SlideProps>[];
}

export default function Slider({
  id,
  className,
  step,
  onChange,
  children,
  offset = 0,
  threshold = 0.05,
}: SliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasTouchedRef = useRef(false);
  const prevStepRef = useRef(step);
  useEffect(() => {
    prevStepRef.current = step;
  });

  const N = React.Children.count(children);

  // slider states
  const [x0, setX0] = useState<number | null | undefined>(null);
  const [dx, setDx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [width, setWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      const nextWidth = ref.current?.offsetWidth;
      if (nextWidth != null && nextWidth !== width) {
        setWidth(nextWidth);
      }
    };

    if (ref.current) {
      handleResize();
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref, width]);

  useEffect(() => {
    // handle keyboards events
    function handleKeydown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowLeft':
          if (step > 0) {
            onChange(step - 1);
          }
          break;

        case 'ArrowRight':
          if (step < N - 1) {
            onChange(step + 1);
          }
          break;

        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeydown, false);
    return () => {
      window.removeEventListener('keydown', handleKeydown, false);
    };
  }, [N, onChange, step]);

  const handleTouchStart = useCallback(
    (
      e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
    ) => {
      if ('touches' in e && e.touches.length > 1) {
        // the event is multi-touch
        e.preventDefault();
        return;
      }

      if (N <= 1) {
        return;
      }
      setX0(getClientX(e));
      setIsDragging(true);

      hasTouchedRef.current = true;
    },
    [N]
  );

  const handleTouchMove = useCallback(
    (
      e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
    ) => {
      if ('touches' in e && e.touches.length > 1) {
        // the event is multi-touch
        e.preventDefault();
        return;
      }

      if (isDragging) {
        const clientX = getClientX(e);
        if (clientX != null && x0 != null) {
          const dx = clientX - x0;
          if (step === 0) {
            // first slide, prevent to swipe left
            if (dx > 0) {
              return;
            }
          } else if (step === N - 1) {
            // last slide, prevent to swipe right
            if (dx < 0) {
              return;
            }
          }
          setDx(dx);
        }
      }
    },
    [isDragging, x0, N, step]
  );

  const handleTouchEnd = useCallback(
    (
      e:
        | React.TouchEvent<HTMLDivElement>
        | React.MouseEvent<HTMLDivElement>
        | TouchEvent
        | MouseEvent
    ) => {
      if (isDragging) {
        const clientX = getClientX(e);
        if (clientX != null && x0 != null && !Number.isNaN(clientX)) {
          const dx = clientX - x0;
          const nextStep = dx > 0 ? step - 1 : step + 1;

          // only allow to transition slides if we dragged for at least 20%
          const pSlided = Math.abs(dx) / width;

          if (nextStep >= 0 && nextStep < N && pSlided > threshold) {
            onChange(nextStep);
          }
        }

        setIsDragging(false);
        setX0(null);
        setDx(0);
      }
    },
    [isDragging, step, x0, width, onChange, N, threshold]
  );

  // Be sure to catch the end event if the touchend or mouseup happens
  // out of screen
  useEffect(() => {
    window.addEventListener('mouseup', handleTouchEnd, false);
    window.addEventListener('touchend', handleTouchEnd, false);
    return () => {
      window.removeEventListener('mouseup', handleTouchEnd, false);
      window.removeEventListener('touchend', handleTouchEnd, false);
    };
  }, [handleTouchEnd]);

  // prevent page drag when user drag the slider content
  useEffect(() => {
    function preventWindowDrag(e: TouchEvent) {
      if (isDragging) {
        e.preventDefault();
      }
    }
    window.addEventListener('touchmove', preventWindowDrag, { passive: false });
    return () => {
      window.removeEventListener('touchmove', preventWindowDrag);
    };
  }, [isDragging]);

  return (
    <SlideContext.Provider value={((1 - offset * 2) * 100) / N}>
      <div id={id} className={classNames(className, styles.wrapper)} ref={ref}>
        <div
          className={classNames(styles.slider, {
            [styles.noTransition]:
              isDragging ||
              (!hasTouchedRef.current && prevStepRef.current === step),
          })}
          style={{
            transform: `translate(${
              getTranslated(step, width, offset) + dx
            }px)`,
            width: `${N * 100}%`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
        >
          {children}
        </div>
      </div>
    </SlideContext.Provider>
  );
}

/**
 * Unify touch and mouse events
 * @param {object} e - a DOM event
 * @return {number} - clientX
 */
function getClientX(
  e:
    | TouchEvent
    | MouseEvent
    | React.TouchEvent<HTMLDivElement>
    | React.MouseEvent<HTMLDivElement>
) {
  let clientX: number | undefined;

  if (e) {
    const ev = 'changedTouches' in e ? e.changedTouches[0] : e;
    if ('clientX' in ev) {
      clientX = ev.clientX;
    }
  }

  return clientX;
}

function getTranslated(step: number, width: number, offset: number) {
  return -1 * (step * ((1 - 2 * offset) * width) - offset * width);
}

interface SlideProps {
  children: React.ReactNode;
}

export function Slide({ children }: SlideProps) {
  const width = useContext(SlideContext);

  return (
    <div
      className={styles.slide}
      style={{
        width: width == null ? 'auto' : `${width}%`,
      }}
    >
      {children}
    </div>
  );
}
