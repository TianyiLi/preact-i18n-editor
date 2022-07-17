import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';
import { ICompareEle } from '../types/ICompareEle';
import { getFile } from '../utils/getFile';
const contentAdapter = createEntityAdapter<ICompareEle>({
  selectId: (content) => content.id,
});

const INITIAL_STATE = {
  ...contentAdapter.getInitialState(),
  isComparing: false,
  localeSetup: {} as Record<string, number[]>,
  nameInUsed: {} as Record<string, string[]>,
  maximumLocale: 0,
};

const updateFile = createAsyncThunk<
  {
    name: string;
    content: Record<string, string>;
    to?: number;
    locale: string;
  },
  { file: File; to?: number; locale: string },
  { state: RootState; dispatch: AppDispatch }
>('file/updateFile', async (arg, thunkApi) => {
  const { file, to, locale } = arg;
  let name = arg.file.name;
  if (arg.to === undefined) {
    const rootState = thunkApi.getState();
    const used = rootState.file.nameInUsed[name];
    if (used && used.includes(locale)) {
      throw new Error(`${name} is already used in ${locale}`);
    }
  }
  const content = await getFile(file);
  return { name, content, to, locale };
});

const fileSlice = createSlice({
  name: 'file',
  initialState: INITIAL_STATE,
  reducers: {
    removeFile(
      state,
      { payload }: { payload: { id: number; locale: string } }
    ) {
      const { id, locale } = payload;
      const name = state.entities[id]!.fileName;
      state.nameInUsed[name] = state.nameInUsed[name].filter(
        (x) => x !== locale
      );
      state.localeSetup[locale] = state.localeSetup[locale].filter(
        (x) => x !== id
      );
      contentAdapter.removeOne(state, payload.id);
      state.maximumLocale = Math.max(
        ...Object.keys(state.localeSetup).map((x) => x.length)
      );
    },
    addLocale(state, { payload: string }) {
      if (state.localeSetup[string] === undefined) {
        state.localeSetup[string] = [];
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(updateFile.fulfilled, (state, action) => {
        const { content, name, to, locale: expectedLocale } = action.payload;
        let id = to ?? state.ids.length;
        const insert = {
          id,
          content,
          fileName: name,
          expectedLocale,
        };
        contentAdapter.upsertOne(state, insert);
        if (!(state.nameInUsed[name] ??= []).includes(expectedLocale)) {
          state.nameInUsed[name].push(expectedLocale);
        }
        if (!(state.localeSetup[expectedLocale] ??= []).includes(id)) {
          state.localeSetup[expectedLocale].push(id);
        }
        state.maximumLocale = Math.max(
          state.maximumLocale,
          state.localeSetup[expectedLocale].length
        );
      })
      .addCase(updateFile.rejected, (state, action) => {
        console.log(action.error);
        alert(action.error);
      });
  },
});

export const {
  reducer: fileReducer,
  actions: { removeFile: removeFileAction, addLocale: addLocaleAction },
} = fileSlice;
export const {
  selectById: selectContentById,
  selectTotal: selectTotalFileAmount,
  selectAll: selectAllContent,
} = contentAdapter.getSelectors((state: RootState) => state.file);

export const updateFileAction = updateFile;
