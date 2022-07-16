import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { selectContentById, updateFileAction } from '../slice/fileSlice';
import { onDrop } from '../utils/getFile';

export function SelectFile({ id }: { id?: number }) {
  const dispatch = useAppDispatch();

  const name = useAppSelector((state) => {
    if (id === undefined) return '';
    return selectContentById(state, id)?.fileName ?? '';
  });

  return (
    <label
      className="cursor:pointer border:1|solid|gray-58 border-radius:8px w:150px h:150px flex ai:center jc:center"
      onDrop={(e) => {
        onDrop(e).then((file) => {
          if (!file) return;
          dispatch(updateFileAction({ file, to: id }));
        });
      }}
    >
      <input
        type="file"
        className="hidden"
        multiple
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          const files = target.files;
          console.dir(target);
          if (files) {
            Promise.all(
              Array.from(files).map((f) => {
                return dispatch(updateFileAction({ file: f, to: id }));
              })
            );
          }
        }}
      />
      {name ? (
        <span className="font-size:20px">{name}</span>
      ) : (
        <span className="font-size:20px">+</span>
      )}
    </label>
  );
}
