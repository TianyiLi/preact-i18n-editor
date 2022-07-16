import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getFile } from '../utils/getFile';

const contentAdapter = createEntityAdapter<{
  id: number;
  fileName: string;
  content: Record<string, string>;
}>({
  selectId: (content) => content.id,
});

const INITIAL_STATE = {
  ...contentAdapter.getInitialState(),
  isComparing: false,
};

const updateFile = createAsyncThunk<
  { name: string; content: Record<string, string>; to?: number },
  { file: File; to?: number }
>('file/updateFile', async (arg) => {
  console.log(arg);
  const content = await getFile(arg.file);
  return { name: arg.file.name, content, to: arg.to };
});

const fileSlice = createSlice({
  name: 'file',
  initialState: INITIAL_STATE,
  reducers: {
    
  },
  extraReducers(builder) {
    builder.addCase(updateFile.fulfilled, (state, action) => {
      const { content, name, to } = action.payload;
      let id = to ?? state.ids.length;
      contentAdapter.upsertOne(state, { id, content, fileName: name });
    });
  },
});

export const {
  reducer: fileReducer,
} = fileSlice;

export const {
  selectById: selectContentById,
  selectTotal: selectTotalFileAmount,
  selectAll: selectAllContent,
} = contentAdapter.getSelectors((state: RootState) => state.file);

export const updateFileAction = updateFile;
