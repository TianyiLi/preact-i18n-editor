import { useAppDispatch, useAppSelector } from '../hooks/redux';

import { setIsComparingAction } from '../slice/compareSlice';
import LocaleGrouping from '../components/LocaleGrouping';
import FileWithLocale from '../components/FileWithLocale';

export const FileContainer = () => {
  const isComparing = useAppSelector((state) => state.compare.isComparing);

  const dispatch = useAppDispatch();
  if (isComparing) return <></>;
  return (
    <>
      <LocaleGrouping />
      <FileWithLocale />
      <button onClick={() => dispatch(setIsComparingAction(true))}>
        submit
      </button>
    </>
  );
};
