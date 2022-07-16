import { useEffect } from 'preact/hooks';
import ContentEditTable from '../components/ContentEditTable';
import SelectWrap from '../components/SelectWrap';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setContentAction } from '../slice/compareSlice';
import { selectAllContent } from '../slice/fileSlice';

export default function SelectContainer() {
  const dispatch = useAppDispatch();
  const files = useAppSelector(selectAllContent);
  const isCompare = useAppSelector((state) => state.compare.isComparing);

  useEffect(() => {
    if (!isCompare) return;
    const arr = [...files];
    if (files.length === 1) {
      arr.push({
        id: -1,
        fileName: 'dummy.json',
        content: {},
      });
    }
    dispatch(setContentAction(arr));
  }, [isCompare, files]);

  if (!isCompare) return <></>;

  return (
    <>
      <SelectWrap />
      <ContentEditTable />
    </>
  );
}
