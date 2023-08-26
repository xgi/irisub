import Portal from './Portal';

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
};

const Modal: React.FC<Props> = (props: Props) => {
  if (!props.isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 bg-opacity-70 bg-slate-1 flex flex-col items-center justify-center overflow-hidden z-50"
        onClick={() => props.handleClose()}
      >
        <div
          className="w-full max-w-lg fixed top-0 mt-40 text-slate-11 bg-slate-1 border border-slate-6 flex flex-col items-center justify-center shadow-md"
          onClick={(e) => e.stopPropagation()}
        >
          {props.children}
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
