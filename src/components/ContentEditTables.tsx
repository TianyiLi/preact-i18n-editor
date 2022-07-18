import { useAppSelector } from '../hooks/redux';
import ContentEditable from './ContentEditable';

export default function ContentEditTables() {
  const usedNamespace = useAppSelector((state) => state.compare.usedNamespace);

  return (
    <div>
      {usedNamespace.map((namespace) => (
        <ContentEditable key={namespace} namespace={namespace} />
      ))}
    </div>
  );
}
