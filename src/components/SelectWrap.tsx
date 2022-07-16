import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { swapAction, toggleUsedIndexAction } from '../slice/compareSlice';

const DraggableTagContainer = () => {
  const tags = useAppSelector((state) => state.compare.useIndex);
  const entities = useAppSelector((state) => state.compare.entities);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex:wrap gap:10px">
      {tags.map((id, i) => {
        return (
          <div
            key={id}
            draggable
            className="p:10px|20px border-radius:20px bg:beryl-76 color:white cursor:pointer"
            onDragStart={(e) => {
              e.dataTransfer?.setData('tagIndex', i + '');
              console.log('test');
            }}
            onDragEnd={(e) => {
              e.dataTransfer?.clearData('tagIndex');
              console.log('testEnd');
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              const tag = e.dataTransfer?.getData('tagIndex');
              console.log(tag);
              if (tag && i != +tag) {
                dispatch(swapAction([i, +tag]));
              }
            }}
          >
            {entities[id]!.fileName}
          </div>
        );
      })}
    </div>
  );
};

const SelectGroup = () => {
  const groups = useAppSelector((state) => state.compare.ids);
  const entities = useAppSelector((state) => state.compare.entities);

  const dispatch = useAppDispatch();
  function onCheck(id: number) {
    dispatch(toggleUsedIndexAction(id));
  }
  return (
    <div className="flex gap:20px m:15px">
      {groups.map((id) => {
        return (
          <label key={id} className="cursor:pointer">
            <input
              className="mr:10px"
              type="checkbox"
              onChange={() => onCheck(id as number)}
            />
            <span>{entities[id]!.fileName}</span>
          </label>
        );
      })}
    </div>
  );
};

export default function SelectWrap() {
  return (
    <div>
      <SelectGroup />
      <DraggableTagContainer />
    </div>
  );
}
