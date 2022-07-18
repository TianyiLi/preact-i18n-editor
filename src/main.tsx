import { render } from 'preact';
import { App } from './app';
import './index.css';
import '@master/css';
import 'preact/debug';

render(<App />, document.getElementById('app') as HTMLElement);
