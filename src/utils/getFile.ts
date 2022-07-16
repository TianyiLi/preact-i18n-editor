import json5 from 'json5';

function getPairs(child = {}, parents = ''): Record<string, string> {
  if (child instanceof Array) {
    return child.reduce((prev, ele, index) => {
      return Object.assign(prev, getPairs(ele, `${parents}[${index}]`));
    }, {});
  } else if (typeof child !== 'object') {
    return { [`${parents}`]: child as string };
  } else {
    return Object.entries(child).reduce((prev, [key, obj]) => {
      return Object.assign(
        prev,
        getPairs(
          obj as object,
          `${parents !== '' ? parents + '.' : parents}${key}`
        )
      );
    }, {});
  }
}

export async function onDrop(e: DragEvent): Promise<File | false> {
  e.preventDefault();
  e.stopPropagation();
  const files = e.dataTransfer?.files;
  if (files) {
    return files[0];
  }
  return false;
}

export async function getFile(f: File) {
  const reader = new FileReader();
  const result: string = await new Promise((res) => {
    reader.onload = (e) => {
      res(e.target!.result as string);
    };
    reader.readAsText(f, 'utf8');
  });
  const data = getPairs(json5.parse(result));
  return data;
}
