import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  swapLocaleAction,
  swapNamespaceAction,
  toggleUsedAllLocaleAction,
  toggleUsedAllNamespaceAction,
  toggleUsedLocaleAction,
  toggleUsedNamespaceAction,
} from '../slice/compareSlice';
type SwapType = typeof swapNamespaceAction;
const DraggableTagWrap = ({
  onSwap,
  used,
}: {
  onSwap: SwapType;
  used: 'usedNamespace' | 'usedLocale';
}) => {
  const tags = useAppSelector((state) => state.compare[used]);
  const dispatch = useAppDispatch();

  function goto(anchor: string) {
    if (used === 'usedLocale') return;
    const top = document.getElementById(anchor)?.offsetTop;
    if (top) {
      window.scrollTo({ top: top - 200, behavior: 'smooth' });
    }
  }

  return (
    <div className="flex flex:wrap gap:10px">
      {tags.map((id, i) => {
        return (
          <div
            key={id}
            draggable
            className="p:10px|20px border-radius:20px bg:beryl-76 color:white cursor:pointer"
            onDragStart={(e) => {
              e.dataTransfer?.setData('tagIndex' + used, i + '');
            }}
            onDragEnd={(e) => {
              e.dataTransfer?.clearData('tagIndex' + used);
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              const tag = e.dataTransfer?.getData('tagIndex' + used);
              e.stopImmediatePropagation();
              if (tag && i != +tag) {
                dispatch(onSwap([i, +tag]));
              }
            }}
            onClick={() => {
              goto(id);
            }}
          >
            {id}
          </div>
        );
      })}
    </div>
  );
};

const SelectGroup = () => {
  const locales = useAppSelector((state) => state.compare.totalLocales);
  const namespaces = useAppSelector((state) => state.compare.totalNamespace);

  const dispatch = useAppDispatch();
  function onNamespaceCheck(name: string) {
    dispatch(toggleUsedNamespaceAction(name));
  }
  function onLocaleCheck(name: string) {
    dispatch(toggleUsedLocaleAction(name));
  }
  return (
    <div>
      <h3>locale</h3>
      <div className="flex flex:wrap gap:20px m:15px">
        <label>
          <input
            className="mr:10px"
            type="checkbox"
            onChange={() => dispatch(toggleUsedAllLocaleAction())}
          />
          <span>All</span>
        </label>
        {locales.map((locale) => {
          return (
            <label key={locale} className="cursor:pointer">
              <input
                className="mr:10px"
                type="checkbox"
                onChange={() => onLocaleCheck(locale)}
              />
              <span>{locale}</span>
            </label>
          );
        })}
      </div>
      <h3>{'{namespace}'}.json</h3>

      <div className="flex flex:wrap gap:20px m:15px">
        <label>
          <input
            className="mr:10px"
            type="checkbox"
            onChange={() => dispatch(toggleUsedAllNamespaceAction())}
          />
          <span>All</span>
        </label>
        {namespaces.map((name) => {
          return (
            <label key={name} className="cursor:pointer">
              <input
                className="mr:10px"
                type="checkbox"
                onChange={() => onNamespaceCheck(name)}
              />
              <span>{name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default function SelectWrap() {
  return (
    <>
      <SelectGroup />
      <div className="flex flex-direction:column gap:10px position:sticky top:0 bg:white pb:20px mb:20px box-shadow:0|8px|8px|gray-90">
        <h3>Locale</h3>
        <DraggableTagWrap onSwap={swapLocaleAction} used="usedLocale" />
        <h3>Namespace</h3>
        <div>
          <DraggableTagWrap onSwap={swapNamespaceAction} used="usedNamespace" />
        </div>
      </div>
    </>
  );
}
