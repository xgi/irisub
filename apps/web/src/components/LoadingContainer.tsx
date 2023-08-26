type Props = unknown;

const LoadingContainer: React.FC<Props> = (props: Props) => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-slate-1">
      <div className="w-6 h-6 border-4 rounded-full border-slate-11 border-b-transparent inline-block box-border animate-spin" />
    </div>
  );
};

export default LoadingContainer;
