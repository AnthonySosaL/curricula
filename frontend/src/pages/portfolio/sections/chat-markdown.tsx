import { Fragment } from 'react';

// Negritas/itálicas inline
function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

// Render ligero de markdown: párrafos y listas con viñetas
export function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let bulletGroup: string[] = [];
  let key = 0;

  const flushBullets = () => {
    if (bulletGroup.length === 0) return;
    elements.push(
      <ul key={key++} className="list-disc list-outside pl-4 space-y-0.5 my-1">
        {bulletGroup.map((b, i) => <li key={i}><InlineText text={b} /></li>)}
      </ul>,
    );
    bulletGroup = [];
  };

  for (const line of lines) {
    const bulletMatch = line.match(/^[-*]\s+(.+)/);
    if (bulletMatch) {
      bulletGroup.push(bulletMatch[1]);
    } else {
      flushBullets();
      if (line.trim() === '') elements.push(<br key={key++} />);
      else elements.push(<p key={key++} className="my-0.5"><InlineText text={line} /></p>);
    }
  }
  flushBullets();

  return <>{elements}</>;
}
