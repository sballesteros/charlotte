import classNames from 'classnames';
import Image from 'next/image';
import styles from './work.module.css';
import type {
  WorkType,
  PhotographType,
  MultiPartPhotographType,
} from '../content/content-types';

interface BaseProps {
  id?: string | number;
  className?: string;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
  galleryName: string;
  galleryIndex: number;
}

type WorkProps = BaseProps & WorkType;

export default function Work(props: WorkProps) {
  const { id, className, loading, galleryName, galleryIndex, type, priority } =
    props;

  switch (type) {
    case 'Photograph': {
      const { file, width, height } = props;
      return (
        <Photograph
          id={id}
          priority={priority}
          className={className}
          loading={loading}
          galleryName={galleryName}
          galleryIndex={galleryIndex}
          file={file}
          width={width}
          height={height}
        />
      );
    }
    case 'MultiPartPhotograph': {
      const { variant, parts } = props;
      return (
        <MultiPartPhotograph
          id={id}
          priority={priority}
          className={className}
          galleryName={galleryName}
          galleryIndex={galleryIndex}
          loading={loading}
          variant={variant}
          parts={parts}
        />
      );
    }
    default:
      return null;
  }
}

type PhotographProps = BaseProps & Omit<PhotographType, 'type'>;

function Photograph({
  id,
  className,
  galleryName,
  galleryIndex,
  file,
  loading,
  priority,
}: PhotographProps) {
  return (
    <Image
      id={id ? id.toString() : undefined}
      className={className}
      alt={`Photograph ${galleryIndex + 1} of the "${galleryName}" collection`}
      loading={loading}
      priority={priority}
      src={`${process.env.NEXT_PUBLIC_STATIC || ''}/media/${file}`}
      layout="fill"
      objectFit="contain"
      draggable={false}
    />
  );
}

type MultiPartPhotographProps = BaseProps &
  Omit<MultiPartPhotographType, 'type'>;

function MultiPartPhotograph({
  id,
  className,
  loading,
  priority,
  variant,
  parts,
  galleryName,
  galleryIndex,
}: MultiPartPhotographProps) {
  return (
    <div
      id={id ? id.toString() : undefined}
      className={classNames(className, styles.multiPart, {
        [styles.horizontal]: variant === 'horizontal',
        [styles.vertical]: variant === 'vertical',
      })}
    >
      {parts.map(({ file }, i) => (
        <div className={styles.part} key={file}>
          <Image
            alt={`Photograph ${
              galleryIndex + 1
            } of the "${galleryName}" collection (part ${i + 1})`}
            loading={loading}
            priority={priority}
            src={`${process.env.NEXT_PUBLIC_STATIC || ''}/media/${file}`}
            layout="fill"
            objectFit="contain"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
