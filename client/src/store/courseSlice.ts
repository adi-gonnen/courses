import { fetchUsers, fetchImages, fetchPlanet } from "../service";
import { User, Image } from '../services/modules';
import { RootState } from './index';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface UserState {
  users: User[] | null;
  images: Image[] | null;
  status: 'loading' | 'succeeded' | 'failed';
  count: number;
}
interface userPayload {
  page: number;
  search: string;
}

const initialState: UserState = {
  users: null,
  images: null,
  status: 'loading',
  count: 1,
};

export const getUsers = createAsyncThunk('user/fetchUsers', async (params: userPayload, { dispatch }) => {
  const {page, search} = params;
    const response = await fetchUsers(page, search);
    dispatch(getImages(page));
    return response;
  }
);

export const getPlanet = createAsyncThunk('user/fetchPlanet', async (url: string) => {
  const response = await fetchPlanet(url);
    return response;
  }
)
export const getImages = createAsyncThunk('user/fetchImages', async (page: number) => {
    const response = await fetchImages(page);
    return response;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        // set users
        const {results, count} = action.payload;
        state.users = results.map((user: User) => ({
          ...user,
          image: '',
          planet: null,
        }));
        state.count = count;
        state.status = 'succeeded';
      })
      .addCase(getImages.fulfilled, (state, action) => {
        //  set image for every user
        state.images = action.payload;
        if (state.users) {
          state.users = state.users.map((user, idx) => {
            let image = '';
            if (state.images) {
              image = state.images[idx]?.download_url || '';
            }
            return { ...user, image };
          });
        }
      })
      .addCase(getPlanet.fulfilled, (state, action) => {
        // set planet for users with same planet id
        if (state.users) {
          state.users = state.users.map((user) => {
            let planet = user.planet || null;
            if (user.homeworld === action.payload.url) {
              planet = action.payload;
            }
            return { ...user, planet };
          });
        }
      })
  },
});

export default userSlice.reducer;
export const selectUser = (state: RootState) => state.users;