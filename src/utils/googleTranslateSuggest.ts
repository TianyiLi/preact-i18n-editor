export default function googleTranslateSuggest(
  from: string,
  to: string,
  text = ''
) {
  window.open(
    `https://translate.google.com/?tl=${to}&sl=${from}&text=${encodeURIComponent(
      text
    )}`,
    '_blank',
    'noopener'
  );
}
