import { useEffect, useRef } from 'preact/hooks';
import googleTranslateSuggest from '../utils/googleTranslateSuggest';
import handleTabKey from '../utils/handleTabKey';

export default function TextArea(props: {
  defaultValue: string;
  leadingValue: string;
  locale: [string, string];
  onChange(str: string): void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.value = props.defaultValue;
    }
  }, [props.defaultValue]);

  function onCopy(e: MouseEvent) {
    e.preventDefault();
    if (ref.current) {
      ref.current.value = props.leadingValue;
      props.onChange(props.leadingValue);
    }
  }

  function onTranslateSuggest() {
    const {
      locale: [leadLocale, targetLocale],
    } = props;
    googleTranslateSuggest(leadLocale, targetLocale, props.leadingValue);
  }

  return (
    <div className="p:10px text-align:left">
      <textarea
        rows={5}
        className="border:1px|solid|gray-58 w:full"
        ref={ref}
        defaultValue={props.defaultValue}
        onChange={(e) => props.onChange(e.currentTarget.value)}
        onKeyDown={handleTabKey}
      />
      <div className="flex flex:wrap gap:10px">
        <button className="p:5px|10px" onClick={onTranslateSuggest}>
          google translate
        </button>
        <button className="p:5px|10px" onClick={onCopy}>
          copy
        </button>
      </div>
    </div>
  );
}
