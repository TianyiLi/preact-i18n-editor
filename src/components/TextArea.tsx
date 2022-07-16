import handleTabKey from '../utils/handleTabKey';

export default function TextArea(props: {
  defaultValue: string;
  onChange(str: string): void;
}) {
  return (
    <textarea
      defaultValue={props.defaultValue}
      onChange={(e) => props.onChange(e.currentTarget.value)}
      onKeyDown={handleTabKey}
    />
  );
}
