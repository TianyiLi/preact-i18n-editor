import { useRef } from 'preact/hooks';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  removeFileAction,
  selectContentById,
  updateFileAction,
} from '../slice/fileSlice';
import { onDrop } from '../utils/getFile';

export function SelectFile({
  id,
  locale,
  isDirSelect,
}: {
  id?: number;
  locale: string;
  isDirSelect: boolean;
}) {
  const dispatch = useAppDispatch();

  const name = useAppSelector((state) => {
    if (id === undefined) return '';
    return selectContentById(state, id)?.fileName ?? '';
  });
  const inputRef = useRef<HTMLInputElement>(null);

  function onDeleteClick(e: MouseEvent) {
    e.stopPropagation();
    if (id === undefined) return;
    dispatch(removeFileAction({ id, locale }));
    inputRef.current?.setAttribute('value', '');
  }

  return (
    <label
      className="cursor:pointer border:1|solid|gray-58 p:10px|15px border-radius:8px min-w:150px min-h:30px flex ai:center jc:center"
      onDrop={(e) => {
        onDrop(e).then((file) => {
          if (!file) return;
          dispatch(updateFileAction({ file, to: id, locale }));
        });
      }}
    >
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        multiple
        {...{
          webkitdirectory: isDirSelect,
        }}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          const files = target.files;
          if (files) {
            Promise.all(
              Array.from(files).map((f) => {
                return dispatch(updateFileAction({ file: f, to: id, locale }));
              })
            );
          }
        }}
      />
      {name ? (
        <div onClick={(e) => e.stopImmediatePropagation()}>
          <button onClick={onDeleteClick}>x</button>
          <span className="font-size:20px">{name}</span>
        </div>
      ) : (
        <span className="font-size:20px">+</span>
      )}
    </label>
  );
}
