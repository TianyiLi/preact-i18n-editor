import { useAppSelector } from '../hooks/redux';
import googleTranslateSuggest from '../utils/googleTranslateSuggest';
import handleTabKey from '../utils/handleTabKey';

export default function TextArea(props: {
  id: number;
  attrKey: string;
  leadingValue: string;
  locale: [string, string];
  onChange(str: string): void;
}) {
  const { id, leadingValue, locale, onChange, attrKey } = props;
  const defaultValue = useAppSelector(state => state.compare.entities[id]?.content[attrKey] ?? '')

  function onCopy(e: MouseEvent) {
    e.preventDefault();
    props.onChange(leadingValue);
  }

  function onTranslateSuggest() {
    const {
      locale: [leadLocale, targetLocale],
    } = props;
    googleTranslateSuggest(leadLocale, targetLocale, leadingValue);
  }

  return (
    <div className="p:10px text-align:left">
      <textarea
        rows={5}
        className="border:1px|solid|gray-58 w:full"
        defaultValue={defaultValue}
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
