import { CSSProperties, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Label = {
  checked: boolean;
  domNode: HTMLElement;
  target: HTMLElement;
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    padding: '0px',
    margin: '10px',
    background: 'none',
    border: 'none',
  },
};

function getDataFromLocalStorage(): { [dataId: string]: boolean } {
  const dataJson = window.localStorage.getItem('data') || `{}`;
  return JSON.parse(dataJson);
}

function setDataToLocalStorage(data: { [dataId: string]: boolean }) {
  window.localStorage.setItem('data', JSON.stringify(data));
}

function useInterval(callback: () => void, delay: number) {
  useEffect(() => {
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
}

const checked = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <rect x="2" y="2" width="28" height="28" rx="4" fill="#4CAF50" stroke="#333333" strokeWidth="2" />
      <path
        d="M8 16 L14 22 L24 10"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 6 Q16 4 28 6" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
    </svg>
  ),
  unchecked = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <rect x="2" y="2" width="28" height="28" rx="4" fill="#ffffff" stroke="#333333" strokeWidth="2" />
      <rect x="4" y="4" width="24" height="24" rx="3" fill="#e0e0e0" />
    </svg>
  );

export default function App() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [url, setUrl] = useState(window.location.href);

  useInterval(() => {
    setUrl(window.location.href);
  }, 1000);

  useEffect(() => {
    const className = '__klakaslskdkdf__';
    const issueElems = Array.from(document.querySelectorAll(`div[id^=issue_]`)) as HTMLElement[];
    const data = getDataFromLocalStorage();
    document.querySelectorAll(`.${className}`).forEach(elem => elem.remove());
    const newLabels = issueElems.map(elem => {
      const dataId = elem.dataset.id || '';
      const target = document.createElement('div');
      target.className = className;
      target.style = { ...target.style, ...styles.container };
      elem.querySelector('div')?.insertBefore(target, elem.querySelector('label'));
      return {
        checked: data[dataId],
        domNode: elem,
        target: target,
      };
    });
    setLabels(newLabels);
    return () => {
      newLabels.forEach(label => {
        label.target.remove();
      });
    };
  }, [url]);

  return (
    <>
      {labels.map((label, i) => {
        const dataId = label.domNode.dataset.id || '';
        return createPortal(
          <button
            style={styles.button}
            onClick={() => {
              const data = getDataFromLocalStorage();
              data[dataId] = !label.checked;
              setDataToLocalStorage(data);
              setLabels(
                labels.map((l, index) => {
                  if (index === i) {
                    return {
                      ...l,
                      checked: !l.checked,
                    };
                  }
                  return l;
                }),
              );
            }}>
            {label.checked ? checked : unchecked}
          </button>,
          label.target,
          `${dataId}`,
        );
      })}
    </>
  );
}
