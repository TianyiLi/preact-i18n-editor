import { useMemo } from 'preact/hooks';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { changeContentAction, selectContentById } from '../slice/compareSlice';
import TextArea from './TextArea';

export default function ContentEditTable() {
  const dispatch = useAppDispatch();
  const { usedIndex, contents } = useAppSelector(
    (state) => ({
      usedIndex: state.compare.useIndex,
      contents: state.compare.entities,
    }),
    (prev, next) => {
      return prev.usedIndex === next.usedIndex;
    }
  );

  const leadingIndex = usedIndex[0];
  const leadingContent = contents[leadingIndex]?.content;
  console.log(usedIndex);

  const contentRender = useMemo(() => {
    if (!leadingContent) return [];
    return Object.entries(leadingContent).map(([trName, value]) => {
      return [
        trName,
        value,
        ...usedIndex.slice(1).map((id) => {
          console.log(id);
          const content = contents[id]?.content;
          return { value: content?.[trName] ?? '', id };
        }),
      ] as [string, string, ...{ value: string; id: number }[]];
    });
  }, [leadingContent, usedIndex]);

  function onColValueChange(id: number, key: string, value: string) {
    dispatch(changeContentAction({ id, key, value }));
  }

  return (
    <table>
      <tbody>
        {contentRender.map(([trName, value, ...rest]) => {
          console.log(rest)
          return (
            <tr key={trName}>
              <td>{trName}</td>
              <td>{value}</td>
              {rest.map(({ value, id }) => (
                <TextArea
                  defaultValue={value}
                  key={id + trName}
                  onChange={onColValueChange.bind(null, id, trName)}
                />
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
