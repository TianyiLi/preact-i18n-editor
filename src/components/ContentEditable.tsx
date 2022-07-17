import { useMemo } from 'preact/hooks';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { changeContentAction } from '../slice/compareSlice';
import TextArea from './TextArea';
import copy from 'copy-to-clipboard';

interface IProps {
  namespace: string;
}
export default function ContentEditable({ namespace }: IProps) {
  const { tree, entities, usedLocale } = useAppSelector(
    (state) => ({
      tree: state.compare.namespaceSetup[namespace],
      usedLocale: state.compare.usedLocale,
      entities: state.compare.entities,
    }),
    (prev, next) =>
      prev.tree === next.tree && prev.usedLocale === next.usedLocale
  );

  const leadingLocaleIndex = useAppSelector(
    (state) => tree[state.compare.usedLocale[0]]
  );
  const ids = usedLocale.map((locale) => tree[locale]);

  const contentList = useMemo(() => {
    const leadingContent = entities[leadingLocaleIndex]?.content;
    if (!leadingContent) return [];
    return Object.entries(leadingContent).map(([trName, value]) => {
      return [
        trName,
        value,
        ...ids.slice(1).map((id, i) => {
          const content = entities[id]?.content;
          return {
            value: content?.[trName] ?? '',
            id,
            locale: usedLocale[i + 1],
          };
        }),
      ] as [string, string, ...{ value: string; id: number; locale: string }[]];
    });
  }, [tree, leadingLocaleIndex, usedLocale]);

  const dispatch = useAppDispatch();
  function onColValueChange(id: number, key: string, value: string) {
    dispatch(changeContentAction({ id, key, value }));
  }

  function onExportClick(locale: string) {
    const content = entities[tree[locale]]?.content;
    if (!content) return;
    const json = JSON.stringify(content, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = namespace;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onCopy(locale: string) {
    const content = entities[tree[locale]]?.content;
    if (!content) return;
    copy(JSON.stringify(content, null, 2));
    alert('Copied!');
  }

  return (
    <table id={namespace} className="mt:40px">
      <caption className="h:50px font-size:20">{namespace}</caption>
      <colgroup>
        <col />
        {usedLocale.map((locale) => (
          <col width="350px" key={locale} />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th>key</th>
          {usedLocale.map((locale) => (
            <th key={locale}>
              {locale}
              <button onClick={() => onExportClick(locale)}>export</button>
              <button onClick={() => onCopy(locale)}>copy</button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {contentList.map(([trName, leadingValue, ...rest]) => {
          return (
            <tr key={trName}>
              <td>{trName}</td>
              <td>{leadingValue}</td>
              {rest.map(({ value, id, locale }) => (
                <td key={id + trName}>
                  <TextArea
                    defaultValue={value}
                    leadingValue={leadingValue}
                    locale={[usedLocale[0], locale]}
                    onChange={onColValueChange.bind(null, id, trName)}
                  />
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
