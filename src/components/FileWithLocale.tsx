import { useMemo, useState } from 'preact/hooks';
import { useAppSelector } from '../hooks/redux';
import { SelectFile } from './FileSelect';

function UpdateContainer({ locale }: { locale: string }) {
  const filesIds = useAppSelector((state) => state.file.localeSetup[locale]);
  const [dirSelect, setDirSelect] = useState(false);

  return (
    <div className="bb:1px|solid|grass-6 pb:20px">
      <h3 className="mb:14px"># {locale} </h3>
      <label
        className="inline-flex color:white:hover align-items:center mb:14px gap:10px p:3px|7px bg:blue-70:hover"
        onClick={(e) => setDirSelect((state) => !state)}
      >
        <input checked={dirSelect} type="checkbox" />
        <span>click to update by {!dirSelect ? 'dir' : 'file'}</span>
      </label>
      <div className="flex gap:12px w:100vh flex:wrap">
        {filesIds.map((id) => (
          <SelectFile key={id} id={id} locale={locale} isDirSelect={false} />
        ))}
        <SelectFile locale={locale} isDirSelect={dirSelect} />
      </div>
    </div>
  );
}

export default function FileWithLocale() {
  const localeSetup = useAppSelector((state) => state.file.localeSetup);

  const locales = useMemo(() => {
    return Object.keys(localeSetup);
  }, [localeSetup]);

  return (
    <div className="flex gap:12px w:100vw flex:wrap flex-direction:column">
      {locales.map((locale) => (
        <UpdateContainer key={locale} locale={locale} />
      ))}
    </div>
  );
}
