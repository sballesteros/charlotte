import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import Collapse from './collapse';
import Button from './button';
import usePrevious from '../hooks/use-previous';
import styles from './layout.module.css';
import type { SiteDataType } from '../content/content-types';

interface LayoutProps
  extends Pick<SiteDataType, 'title' | 'email' | 'galleries'> {
  children: React.ReactNode;
}

export default function Layout({
  title,
  email,
  galleries,
  children,
}: LayoutProps) {
  const [isNavOpened, setIsNavOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isWorkNavOpened, setIsWorkNavOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const openNavRef = useRef<HTMLButtonElement>(null);
  const closeNavRef = useRef<HTMLButtonElement>(null);

  const prevIsNavOpened = usePrevious(isNavOpened);

  useEffect(() => {
    // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    let rafId: number;
    function handleResize() {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(() => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
    }
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Auto-close nav on click outside (an navigation (click on nav link))
    function handleClick(e: Event) {
      if (
        isNavOpened &&
        navRef.current &&
        e.target instanceof HTMLElement &&
        (!navRef.current.contains(e.target) ||
          (navRef.current.contains(e.target) && e.target.localName === 'a'))
      ) {
        setIsNavOpen(false);
      }
    }

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [isNavOpened]);

  useEffect(() => {
    // focus management
    if (isNavOpened && !prevIsNavOpened) {
      if (closeNavRef.current) {
        closeNavRef.current.focus();
      }
    } else if (prevIsNavOpened) {
      openNavRef.current?.focus();
    }
  }, [isNavOpened, prevIsNavOpened]);

  useEffect(() => {
    // keyboard nav:
    // - close on Esc
    // - trap focus in side menu
    function handleKeyup(e: KeyboardEvent) {
      switch (e.key) {
        case 'Escape':
          if (isNavOpened) {
            setIsNavOpen(false);
          }
          break;
        default:
          break;
      }
    }

    window.addEventListener('keyup', handleKeyup, false);
    return () => {
      window.removeEventListener('keyup', handleKeyup, false);
    };
  }, [isNavOpened]);

  return (
    <>
      <header className={styles.header}>
        <Button
          ref={openNavRef}
          aria-label="open navigation"
          aria-controls="nav"
          aria-expanded={isNavOpened}
          onClick={() => {
            setIsVisible(true);
            setIsNavOpen(true);
          }}
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>

        <h1>
          <Link href="/">
            <a>{title}</a>
          </Link>
        </h1>
      </header>

      <nav
        id="nav"
        ref={navRef}
        className={classNames(styles.nav, {
          [styles.navVisible]: isNavOpened,
        })}
        onTransitionEnd={() => {
          setIsVisible(isNavOpened);
        }}
        style={{ visibility: isVisible ? 'visible' : 'hidden' }}
      >
        <header>
          <Link href="/">
            <a>{title}</a>
          </Link>

          <Button
            className={styles.navClose}
            aria-label="close navigation"
            ref={closeNavRef}
            onClick={() => {
              setIsNavOpen(false);
              // Note: isVisible will be set after the transition has ended
            }}
          >
            <svg
              aria-hidden="true"
              fill="none"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </header>

        <div className={styles.navBody}>
          <ul>
            <li>
              <Button
                onClick={() => setIsWorkNavOpen(!isWorkNavOpened)}
                aria-label={
                  isWorkNavOpened ? 'close navigation' : 'open navigation'
                }
                aria-controls="work-nav"
                aria-expanded={isWorkNavOpened}
              >
                Work
              </Button>
              <Collapse id="work-nav" isOpened={isWorkNavOpened}>
                <ul>
                  {galleries
                    .filter(({ isComissioned }) => {
                      return !isComissioned;
                    })
                    .map(({ name, slug }) => (
                      <li key={slug}>
                        <Link href={`/${slug}`}>
                          <a>{name}</a>
                        </Link>
                      </li>
                    ))}
                </ul>

                <ul>
                  {galleries
                    .filter(({ isComissioned }) => {
                      return isComissioned;
                    })
                    .map(({ name, slug }) => (
                      <li key={slug}>
                        <Link href={`/${slug}`}>
                          <a>{name}</a>
                        </Link>
                      </li>
                    ))}
                </ul>
              </Collapse>
            </li>

            <li>
              <Link href="/bio">
                <a>Bio</a>
              </Link>
            </li>

            <li>
              <Link href="/journal">
                <a>Journal</a>
              </Link>
            </li>

            <li>
              <Link href="/contact">
                <a>Contact</a>
              </Link>
            </li>
          </ul>
        </div>

        <footer>
          <p>
            © {new Date().getFullYear()}{' '}
            <a href={`mailto:${email}`}>Charlotte Ballesteros</a>
          </p>
        </footer>
      </nav>

      <main>{children}</main>
    </>
  );
}
