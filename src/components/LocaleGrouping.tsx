import { JSXInternal } from 'preact/src/jsx';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addLocaleAction, setLocaleAction } from '../slice/compareSlice';

export default function LocaleGrouping() {
  const compareEntities = useAppSelector((state) => state.compare.entities);
  const compareIds = useAppSelector((state) => state.compare.ids);
  const usedIds = useAppSelector((state) => state.compare.useIndex);

  const localeSetup = useAppSelector((state) => state.compare.localSetup);

  const dispatch = useAppDispatch();

  return (
    <div>
      <input
        type="text"
        placeholder="add locale"
        onKeyDown={(e) =>
          e.key === 'Enter' && dispatch(addLocaleAction(e.currentTarget.value))
        }
      />
      <div># key down to add new locale</div>

      {Object.keys(localeSetup).map((locale) => (
        <div key={locale}>
          <h2>{locale}</h2>
          <div
            className="mt:20px"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const tagIndex = e.dataTransfer?.getData('tagIndex');
              if (tagIndex) {
                dispatch(setLocaleAction({ id: +tagIndex, locale }));
              }
            }}
          >
            {usedIds.reduce((prev, id) => {
              const { fileName, expectedLocale } = compareEntities[id]!;
              if (expectedLocale !== locale) return prev;
              const node = (
                <div
                  onClick={() => {
                    const shouldDelete = window.confirm(`delete ${fileName}`);
                    shouldDelete &&
                      dispatch(setLocaleAction({ id, locale: undefined }));
                  }}
                >
                  x {fileName}
                </div>
              );
              prev.push(node);
              return prev;
            }, [] as JSXInternal.Element[])}
          </div>
        </div>
      ))}
    </div>
  );
}
