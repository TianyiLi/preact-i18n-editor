import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { selectTotalFileAmount } from '../slice/fileSlice';

import { range } from 'lodash-es';
import { SelectFile } from '../components/FileSelect';
import { setIsComparingAction } from '../slice/compareSlice';

export const FileContainer = () => {
  const totalFileIds = useAppSelector(selectTotalFileAmount);
  const idsRange = range(totalFileIds);

  const dispatch = useAppDispatch();

  return (
    <>
      <div className="flex gap:12px w:100vh flex:wrap">
        {idsRange.map((id) => (
          <SelectFile key={id} id={id} />
        ))}
        <SelectFile />
      </div>
      <button onClick={() => dispatch(setIsComparingAction(true))}>
        submit
      </button>
    </>
  );
};
