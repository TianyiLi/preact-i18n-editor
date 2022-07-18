import { useMemo } from 'preact/hooks';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { changeContentAction, copyAction, exportAction } from '../slice/compareSlice';
import { RootState } from '../store';
import TextArea from './TextArea';

interface IProps {
  namespace: string;
}

export default function ContentEditable({ namespace }: IProps) {
  const tree = useAppSelector(
    (state: RootState) => state.compare.namespaceSetup[namespace]
  );
  const leadEntities = useAppSelector(
    (state: RootState) =>
      state.compare.entities[
        state.compare.namespaceSetup[namespace][state.compare.usedLocale[0]]
      ]!
  );
  const usedLocale = useAppSelector((state) => state.compare.usedLocale);

  const leadingLocaleIndex = useAppSelector(
    (state) => tree[state.compare.usedLocale[0]]
  );
  const ids = usedLocale.map((locale) => tree[locale]);
  const contentList = useMemo(() => {
    const leadingContent = leadEntities.content;
    if (!leadingContent) return [];
    return Object.entries(leadingContent).map(([trName, value]) => {
      return [
        trName,
        value,
        ...ids.slice(1).map((id, i) => {
          return {
            id,
            locale: usedLocale[i + 1],
          };
        }),
      ] as [string, string, ...{ id: number; locale: string }[]];
    });
  }, [tree, leadingLocaleIndex, usedLocale]);

  const dispatch = useAppDispatch();
  function onColValueChange(id: number, key: string, value: string) {
    dispatch(changeContentAction({ id, key, value }));
  }

  function onExportClick(locale: string) {
    dispatch(exportAction(tree[locale]));
  }

  function onCopy(locale: string) {
    dispatch(copyAction(tree[locale]));
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
              {rest.map(({ id, locale }) => (
                <td key={id + trName}>
                  <TextArea
                    id={id}
                    attrKey={trName}
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
