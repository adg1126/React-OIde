import './Preview.css';
import React, { useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
  bundlingErr: string;
}

const html = `
<html>
  <head>
    <style>html { background-color: white; }</style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      const handleError = (err) => {
        const root = document.querySelector('#root');
        root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
        console.error(err);
      };
      
      window.addEventListener('error', (e) => {
        e.preventDefault();
        handleError(e.error);
      })

      window.addEventListener('message', (e) => {
        try {
          eval(e.data)
        } catch (err) {
          handleError(err);
        }
      }, false)
    </script>
  </body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code, bundlingErr }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;

    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className='preview-wrapper'>
      <iframe
        ref={iframe}
        sandbox='allow-scripts'
        srcDoc={html}
        title='code-preview'
      />
      {bundlingErr && (
        <p className='subtitle is-5' id='preview-error'>
          {bundlingErr}
        </p>
      )}
    </div>
  );
};

export default Preview;
