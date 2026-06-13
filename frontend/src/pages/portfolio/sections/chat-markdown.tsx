import { Fragment } from 'react';

// Limpia "basura" que a veces genera el LLM: placeholders en <...>, etiquetas HTML,
// URLs crudas (el boton ya las maneja) e instrucciones tipo "(haga clic aqui...)".
function cleanReply(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')                                  // <boton...>, <button>, <https://...>
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')                  // markdown [texto](url) -> texto
    .replace(/\b(?:https?:\/\/|www\.)[^\s)<>]+/gi, '')        // URLs crudas
    .replace(/\((?:[^)]*?(?:haga clic|hacer clic|click|por favor)[^)]*?)\)/gi, '') // "(Por favor, haga clic...)"
    .replace(/\(\s*[:：.]?\s*\)/g, '')                         // parentesis vacios
    .replace(/[ \t]+([.,;:])/g, '$1')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

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
  const lines = cleanReply(text).split('\n');
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
