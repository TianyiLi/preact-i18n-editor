import { useEffect } from 'preact/hooks';
import ContentEditTables from '../components/ContentEditTables';
import SelectWrap from '../components/SelectWrap';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setContentAction } from '../slice/compareSlice';
import { selectAllContent } from '../slice/fileSlice';
import { xor } from 'lodash-es';
export default function SelectContainer() {
  const dispatch = useAppDispatch();
  const files = useAppSelector(selectAllContent);
  const localeSetup = useAppSelector((state) => state.file.localeSetup);
  const nameInUsed = useAppSelector((state) => state.file.nameInUsed);
  const maximum = useAppSelector((state) => state.file.maximumLocale);
  const isCompare = useAppSelector((state) => state.compare.isComparing);

  useEffect(() => {
    if (!isCompare) return;
    const arr = [...files];
    // add dummy data

    let id = arr.length;

    const totalNamespace = [...new Set(arr.map((e) => e.fileName))];

    Object.entries(localeSetup).forEach(([locale, ids]) => {
      if (ids.length === maximum) return false;
      const namespaceLocaleUsed = nameInUsed[locale];
      const _temp = xor(namespaceLocaleUsed, totalNamespace);

      _temp.forEach((name) =>
        arr.push({
          id: id++,
          expectedLocale: locale,
          fileName: name,
          content: {},
        })
      );
    });

    dispatch(setContentAction(arr));
  }, [isCompare, files]);

  if (!isCompare) return <></>;

  return (
    <>
      <SelectWrap />
      <ContentEditTables />
    </>
  );
}
