import { xor } from 'lodash-es';
import { useEffect } from 'preact/hooks';
import { shallowEqual } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import ContentEditTables from '../components/ContentEditTables';
import SelectWrap from '../components/SelectWrap';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setContentAction } from '../slice/compareSlice';
import { selectAllContent } from '../slice/fileSlice';
import { RootState } from '../store';

const structSelector = createStructuredSelector({
  files: selectAllContent,
  localeSetup: (state:RootState) => state.file.localeSetup,
  nameInUsed: (state:RootState) => state.file.nameInUsed,
  maximum: (state:RootState) => state.file.maximumLocale,
});

export default function SelectContainer() {
  const dispatch = useAppDispatch();
  const { files, localeSetup, nameInUsed, maximum } =
    useAppSelector(structSelector, shallowEqual);
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
