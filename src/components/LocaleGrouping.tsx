import { useAppDispatch } from '../hooks/redux';
import { addLocaleAction } from '../slice/fileSlice';

export default function LocaleGrouping() {
  const dispatch = useAppDispatch();

  return (
    <div className="flex gap:20px align-items:center mb:20px ml:15px mt:14px">
      <input
        type="text"
        placeholder="add locale"
        className="border:1|solid|gray-58 p:10px|15px border-radius:8px min-w:150px min-h:30px"
        onKeyDown={(e) =>
          e.key === 'Enter' && dispatch(addLocaleAction(e.currentTarget.value)) && (e.currentTarget.value = '')
        }
      />
      <div># type enter to add new locale</div>
    </div>
  );
}
