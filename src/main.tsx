import { render } from 'preact';
import { App } from './app';
import './index.css';
import '@master/css';

render(<App />, document.getElementById('app') as HTMLElement);
