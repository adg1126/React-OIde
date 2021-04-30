import './TextEditor.css';
import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';

const TextEditor: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (ref.current && e.target && ref.current.contains(e.target as Node))
        return;

      setEditing(false);
    };

    document.addEventListener('click', listener, { capture: true });

    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  const handleClick = () => {
    setEditing(true);
  };

  return editing ? (
    <div ref={ref}>
      <MDEditor />
    </div>
  ) : (
    <div onClick={handleClick}>
      <MDEditor.Markdown source={'# Click me to edit'} />
    </div>
  );
};

export default TextEditor;