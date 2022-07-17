import expand, { extract } from 'emmet';
import { VALID_HTML } from '../constant/validHTML';
export default function handleTabKey(
  this: HTMLTextAreaElement,
  _e: KeyboardEvent
) {
  const e = _e as KeyboardEvent & { target: HTMLTextAreaElement };
  if (e.key.toLowerCase() === 'tab') {
    let _start = e.target.selectionStart;
    let _end = e.target.selectionEnd;
    e.preventDefault();

    if (_start > _end) {
      [_start, _end] = [_end, _start];
    }

    const isRangeSelection = _start !== _end;
    let alreadyEmmet = false;
    if (isRangeSelection) {
      const selectedText = e.target.value.slice(_start, _end);
      const _selectedText = extract(selectedText);
      if (_selectedText) {
        if (VALID_HTML.test(_selectedText.abbreviation)) {
          const replacedTextAfterEmmet = expand(_selectedText.abbreviation);
          e.target.value =
            e.target.value.slice(0, _start) +
            replacedTextAfterEmmet +
            e.target.value.slice(_end);
          alreadyEmmet = true;
        }
      }
    } else {
      const _extract = extract(e.target.value);
      if (_extract) {
        if (VALID_HTML.test(_extract.abbreviation)) {
          const replacedTextAfterEmmet = expand(_extract.abbreviation || '');
          e.target.value =
            e.target.value.slice(0, _extract.start) +
            replacedTextAfterEmmet +
            e.target.value.slice(_extract.end);
          alreadyEmmet = true;
        }
      }
      if (!alreadyEmmet) {
        e.target.value =
          e.target.value.slice(0, _start) + '\t' + e.target.value.slice(_end);
      }
    }
  }
}
