import { Link } from 'wouter';
import styles from '../styles/components/NotFoundPage.module.scss';
import Button from './Button';

type Props = unknown;

const NotFoundPage: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles.container}>
      <h1>Page Not Found</h1>
      <div className={styles.buttons}>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
        <Link href="/">
          <Button accent>Go to Editor</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
