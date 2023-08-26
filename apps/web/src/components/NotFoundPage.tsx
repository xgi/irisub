import { Link } from 'wouter';
import Button from './Button';

type Props = unknown;

const NotFoundPage: React.FC<Props> = (props: Props) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4 font-bold bg-slate-1 text-slate-12">
      <h1>Page Not Found</h1>
      <div className="flex gap-2">
        <Button onClick={() => window.location.reload()}>Refresh</Button>
        <Link href="/">
          <Button accent>Go to Editor</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
