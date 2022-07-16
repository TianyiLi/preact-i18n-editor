import './app.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { FileContainer } from './container/FileContainer';
import SelectContainer from './container/CompareContainer';

const Container: any = () => {
  return (
    <div>
      <FileContainer />
      <SelectContainer />
    </div>
  );
};

export function App() {
  const container: any = <Container />;
  return <Provider store={store}>{container}</Provider>;
}
